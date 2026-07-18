export const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools', 'Others']

export const LUCIDE_ICON_OPTIONS = [
  { value: 'atom', label: 'Atom (React)' },
  { value: 'server', label: 'Server' },
  { value: 'database', label: 'Database' },
  { value: 'waypoints', label: 'Waypoints' },
  { value: 'layout-template', label: 'Layout' },
  { value: 'file-code-2', label: 'Code File' },
  { value: 'git-branch', label: 'Git Branch' },
  { value: 'folder-git-2', label: 'GitHub' },
  { value: 'code-2', label: 'Code' },
  { value: 'box', label: 'Box' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'braces', label: 'Braces' },
  { value: 'gauge', label: 'Gauge' },
  { value: 'rocket', label: 'Rocket' },
]

export const EMPTY_SKILL_FORM = {
  name: '',
  slug: '',
  category: 'Frontend',
  percentage: 80,
  displayOrder: 0,
  published: true,
  iconType: 'lucide',
  lucideIcon: 'code-2',
  iconUrl: '',
  description: '',
}

export const EMPTY_PROFILE_FORM = {
  fullName: '',
  professionalTitle: '',
  animatedTitles: [],
  shortBio: '',
  heroDescription: '',
  profileImage: '',
  location: '',
  email: '',
  phone: '',
  phoneE164: '',
  githubUrl: '',
  githubDisplay: '',
  linkedinUrl: '',
  linkedinDisplay: '',
  website: '',
  yearsOfExperience: 0,
  availability: '',
  skillsHeading: '',
  skillsDescription: '',
  skillsDescription2: '',
}
