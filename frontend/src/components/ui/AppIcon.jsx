import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Atom,
  Boxes,
  Bug,
  Check,
  Cloud,
  Code2,
  Coffee,
  Database,
  Download,
  ExternalLink,
  Eye,
  FolderGit2,
  Gauge,
  GitBranch,
  GitCommit,
  Globe,
  Layers,
  Layout,
  Lightbulb,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  Rocket,
  Search,
  Send,
  Server,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const ICON_MAP = {
  rocket: Rocket,
  atom: Atom,
  server: Server,
  database: Database,
  trophy: Trophy,
  globe: Globe,
  target: Target,
  lightbulb: Lightbulb,
  smartphone: MonitorSmartphone,
  zap: Zap,
  palette: Palette,
  stack: Boxes,
  responsive: MonitorSmartphone,
  api: Code2,
  performance: Zap,
  code: Code2,
  git: GitBranch,
  folder: FolderGit2,
  layout: Layout,
  sparkles: Sparkles,
  gauge: Gauge,
  activity: Activity,
  layers: Layers,
  check: Check,
  lock: Lock,
  external: ExternalLink,
  cloud: Cloud,
  commit: GitCommit,
  shield: Shield,
  bug: Bug,
  search: Search,
  mail: Mail,
  map: MapPin,
  whatsapp: MessageCircle,
  linkedin: Link2,
  download: Download,
  eye: Eye,
  send: Send,
  coffee: Coffee,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
}

/**
 * Consistent Lucide outline icons for the portfolio.
 * strokeWidth 1.5 — soft blue glow on hover via parent group.
 */
export default function AppIcon({
  name,
  size = 20,
  className,
  strokeWidth = 1.5,
}) {
  const Icon = ICON_MAP[name] || Code2

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth={false}
      className={cn(
        'shrink-0 text-secondary transition-all duration-300',
        'group-hover/panel:text-secondary group-hover/panel:drop-shadow-[0_0_8px_rgba(56,189,248,0.55)]',
        'group-hover/card:text-secondary group-hover/card:drop-shadow-[0_0_8px_rgba(56,189,248,0.55)]',
        'group-hover/icon:text-secondary group-hover/icon:drop-shadow-[0_0_8px_rgba(56,189,248,0.55)]',
        'group-hover/gallery:drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]',
        className,
      )}
      aria-hidden="true"
    />
  )
}
