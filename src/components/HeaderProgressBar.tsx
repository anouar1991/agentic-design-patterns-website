import { motion, useReducedMotion } from 'framer-motion'
import { useProgress } from '../contexts/ProgressContext'

/**
 * Thin progress bar at the bottom edge of the header.
 * Shows overall course completion as a gradient-filled bar.
 * Colors follow the chapter accent color palette.
 */

const CHAPTER_COLORS = [
  '#f59e0b', // 1  Prompt Chaining (amber)
  '#10b981', // 2  Routing (emerald)
  '#3b82f6', // 3  Parallelization (blue)
  '#ec4899', // 4  Reflection (pink)
  '#f97316', // 5  Tool Use (orange)
  '#14b8a6', // 6  Planning (teal)
  '#8b5cf6', // 7  Multi-Agent (violet)
  '#06b6d4', // 8  Memory (cyan)
  '#84cc16', // 9  Learning (lime)
  '#a855f7', // 10 MCP (purple)
  '#f43f5e', // 11 Goal Setting (rose)
  '#ef4444', // 12 Exception Handling (red)
  '#22c55e', // 13 Human-in-Loop (green)
  '#3b82f6', // 14 RAG (blue)
  '#6366f1', // 15 A2A (indigo)
  '#ec4899', // 16 Resource-Aware (pink)
  '#f97316', // 17 Reasoning (orange)
  '#10b981', // 18 Guardrails (emerald)
  '#06b6d4', // 19 Evaluation (cyan)
  '#a855f7', // 20 Prioritization (purple)
  '#f43f5e', // 21 Exploration (rose)
]

function buildGradientStops(): string {
  return CHAPTER_COLORS.map((color, i) => {
    const pct = (i / (CHAPTER_COLORS.length - 1)) * 100
    return `${color} ${pct.toFixed(1)}%`
  }).join(', ')
}

const gradientStops = buildGradientStops()

export default function HeaderProgressBar() {
  const { completionPercentage } = useProgress()
  const prefersReducedMotion = useReducedMotion()

  // Don't render if 0% — no progress yet
  if (completionPercentage <= 0) return null

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-[2px] bg-dark-800/40 overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(completionPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Course progress: ${Math.round(completionPercentage)}%`}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          background: `linear-gradient(to right, ${gradientStops})`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: completionPercentage / 100 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 80, damping: 25 }
        }
      />
    </div>
  )
}
