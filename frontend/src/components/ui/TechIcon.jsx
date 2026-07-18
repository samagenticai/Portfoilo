import {
  Atom,
  Box,
  Braces,
  Code2,
  Database,
  FileCode2,
  FolderGit2,
  GitBranch,
  LayoutTemplate,
  Server,
  Triangle,
  Waypoints,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const ICON_MAP = {
  react: Atom,
  atom: Atom,
  nextjs: Triangle,
  javascript: FileCode2,
  'file-code-2': FileCode2,
  typescript: FileCode2,
  tailwind: LayoutTemplate,
  'layout-template': LayoutTemplate,
  nodejs: Server,
  server: Server,
  express: Waypoints,
  waypoints: Waypoints,
  restapi: Braces,
  braces: Braces,
  mongodb: Database,
  database: Database,
  git: GitBranch,
  'git-branch': GitBranch,
  github: FolderGit2,
  'folder-git-2': FolderGit2,
  vscode: Code2,
  'code-2': Code2,
  postman: Box,
  box: Box,
  vercel: Triangle,
  triangle: Triangle,
  render: Server,
}

export default function TechIcon({ name, iconUrl, label, className, size = 'md' }) {
  const sizes = { sm: 18, md: 22, lg: 26 }
  const px = sizes[size] || sizes.md
  const iconLabel = label || name || 'Technology'

  if (iconUrl) {
    return (
      <div className={cn('flex shrink-0 items-center justify-center', className)} style={{ width: px, height: px }}>
        <img
          src={iconUrl}
          alt={`${iconLabel} icon`}
          loading="lazy"
          decoding="async"
          className="h-full w-full rounded-md object-cover"
        />
      </div>
    )
  }

  const Icon = ICON_MAP[name] || Code2

  return (
    <div
      className={cn(
        'group/icon flex shrink-0 items-center justify-center text-secondary',
        'transition-all duration-300',
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Icon
        size={px}
        strokeWidth={1.5}
        className="transition-all duration-300 group-hover/orbit:drop-shadow-[0_0_8px_rgba(56,189,248,0.55)]"
        aria-hidden="true"
      />
    </div>
  )
}
