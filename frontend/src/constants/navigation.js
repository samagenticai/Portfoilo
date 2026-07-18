export { PROFILE } from './profile'

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#why-hire-me' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

/** Section IDs watched for active nav highlighting */
export const NAV_SECTION_IDS = [
  'home',
  'why-hire-me',
  'skills',
  'journey',
  'projects',
  'process',
  'contact',
]

/** Map in-between sections to a primary nav item */
export const SECTION_NAV_ALIAS = {
  journey: 'skills',
  process: 'projects',
}
