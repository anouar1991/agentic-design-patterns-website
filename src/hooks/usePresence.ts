import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Hook to track real-time presence for a specific chapter.
 * Shows how many users are currently viewing the chapter.
 * Works for both authenticated and anonymous users.
 *
 * Uses Supabase Realtime Presence which is per-channel scoped.
 * Each chapter gets its own presence channel: `chapter-presence-{id}`.
 */
export function usePresence(chapterId: number | null) {
  const [count, setCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const userKeyRef = useRef<string>(generateUserKey())

  useEffect(() => {
    if (chapterId === null || !isSupabaseConfigured()) return

    const channelName = `chapter-presence-${chapterId}`
    const channel = supabase!.channel(channelName, {
      config: { presence: { key: userKeyRef.current } },
    })

    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const uniqueUsers = Object.keys(state).length
        setCount(uniqueUsers)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          await channel.track({ online_at: new Date().toISOString() })
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false)
        }
      })

    return () => {
      channel.untrack()
      supabase!.removeChannel(channel)
      channelRef.current = null
      setIsConnected(false)
    }
  }, [chapterId])

  return { count, isConnected }
}

/**
 * Hook to get aggregated presence counts across multiple chapters.
 * Uses a single broadcast channel where chapter viewers announce their presence.
 * List pages listen for heartbeat broadcasts to aggregate counts.
 *
 * Architecture:
 * - Chapter pages broadcast {type: 'heartbeat', chapterId} every 30s
 * - List pages listen for heartbeats and maintain a count per chapter
 * - Counts decay if no heartbeat received for 45s (cleanup stale entries)
 */
export function useAggregatedPresence(chapterIds: number[]) {
  const [counts, setCounts] = useState<Record<number, number>>({})
  const channelRef = useRef<RealtimeChannel | null>(null)
  const trackingRef = useRef<Map<string, { chapterId: number; lastSeen: number }>>(new Map())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured() || chapterIds.length === 0) return

    const channel = supabase!.channel('chapter-activity')

    channel
      .on('broadcast', { event: 'heartbeat' }, ({ payload }) => {
        const { chapterId, userKey } = payload as { chapterId: number; userKey: string }
        if (chapterIds.includes(chapterId)) {
          trackingRef.current.set(userKey, { chapterId, lastSeen: Date.now() })
          recalcCounts()
        }
      })
      .subscribe()

    channelRef.current = channel

    // Periodically clean stale entries (no heartbeat for 45s)
    intervalRef.current = setInterval(() => {
      const now = Date.now()
      let changed = false
      for (const [key, entry] of trackingRef.current) {
        if (now - entry.lastSeen > 45_000) {
          trackingRef.current.delete(key)
          changed = true
        }
      }
      if (changed) recalcCounts()
    }, 15_000)

    function recalcCounts() {
      const newCounts: Record<number, number> = {}
      for (const entry of trackingRef.current.values()) {
        newCounts[entry.chapterId] = (newCounts[entry.chapterId] ?? 0) + 1
      }
      setCounts(newCounts)
    }

    return () => {
      if (channelRef.current) {
        supabase!.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      trackingRef.current.clear()
    }
  }, [chapterIds.join(',')])

  const getCount = useCallback(
    (chapterId: number) => counts[chapterId] ?? 0,
    [counts]
  )

  return { counts, getCount }
}

/**
 * Hook used by chapter pages to broadcast heartbeats for aggregated presence.
 * Must be used alongside usePresence on chapter pages.
 */
export function usePresenceHeartbeat(chapterId: number | null) {
  const userKeyRef = useRef<string>(generateUserKey())
  const channelRef = useRef<RealtimeChannel | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (chapterId === null || !isSupabaseConfigured()) return

    const channel = supabase!.channel('chapter-activity')

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Send initial heartbeat
        await channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { chapterId, userKey: userKeyRef.current },
        })

        // Send periodic heartbeats every 30s
        intervalRef.current = setInterval(async () => {
          await channel.send({
            type: 'broadcast',
            event: 'heartbeat',
            payload: { chapterId, userKey: userKeyRef.current },
          })
        }, 30_000)
      }
    })

    channelRef.current = channel

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (channelRef.current) {
        supabase!.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [chapterId])
}

function generateUserKey(): string {
  const stored = sessionStorage.getItem('presence-user-key')
  if (stored) return stored
  const key = crypto.randomUUID()
  sessionStorage.setItem('presence-user-key', key)
  return key
}
