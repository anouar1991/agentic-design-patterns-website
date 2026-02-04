import {
  GitBranch,
  Layers,
  RefreshCw,
  Wrench,
  Map,
  Users,
  HardDrive,
  TrendingUp,
  Plug,
  Target,
  AlertTriangle,
  UserCheck,
  Search,
  MessageCircle,
  Cpu,
  Brain,
  Shield,
  Activity,
  ListOrdered,
  Compass,
  Zap,
} from 'lucide-react'
import type { ElementType } from 'react'

/**
 * Maps chapter icon string identifiers (from chapterDetails) to Lucide icon components.
 * Shared across Chapter page, header breadcrumb, and anywhere else chapter icons are needed.
 */
export const chapterIconMap: Record<string, ElementType> = {
  link: GitBranch,
  'git-branch': GitBranch,
  layers: Layers,
  'refresh-cw': RefreshCw,
  tool: Wrench,
  map: Map,
  users: Users,
  'hard-drive': HardDrive,
  'trending-up': TrendingUp,
  plug: Plug,
  target: Target,
  'alert-triangle': AlertTriangle,
  'user-check': UserCheck,
  search: Search,
  'message-circle': MessageCircle,
  cpu: Cpu,
  brain: Brain,
  'shield-check': Shield,
  activity: Activity,
  'list-ordered': ListOrdered,
  compass: Compass,
}

/** Get a Lucide icon component for a chapter icon string, with Zap as fallback. */
export function getChapterIcon(iconName: string): ElementType {
  return chapterIconMap[iconName] || Zap
}
