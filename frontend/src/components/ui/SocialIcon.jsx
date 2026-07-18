import AppIcon from './AppIcon'

const ICON_NAMES = {
  github: 'folder',
  linkedin: 'linkedin',
  email: 'mail',
  resume: 'download',
}

/** Footer/social icons — Lucide via AppIcon for consistent stroke language */
export default function SocialIcon({ name, className }) {
  const iconName = ICON_NAMES[name]
  if (!iconName) return null
  return <AppIcon name={iconName} size={18} className={className} />
}
