import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  theme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'theme-mode'

function getAutoTheme(): ResolvedTheme {
  const hour = new Date().getHours()
  // Light theme from 6 AM to 6 PM
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'auto') {
    return getAutoTheme()
  }
  return mode
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored
    }
    return 'dark' // Default to dark
  })

  const [theme, setTheme] = useState<ResolvedTheme>(() => resolveTheme(mode))

  // Update theme when mode changes
  useEffect(() => {
    setTheme(resolveTheme(mode))
  }, [mode])

  // Update auto theme every minute
  useEffect(() => {
    if (mode !== 'auto') return

    const interval = setInterval(() => {
      setTheme(getAutoTheme())
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [mode])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [theme])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
  }

  return (
    <ThemeContext.Provider value={{ mode, theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
