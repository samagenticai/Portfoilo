export const TECH_OPTIONS = [
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'MongoDB',
  'PostgreSQL',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Redux Toolkit',
  'Socket.io',
  'Prisma',
  'Stripe',
  'GSAP',
  'Framer Motion',
  'Vite',
  'JWT',
  'REST API',
  'GraphQL',
  'Docker',
]

export const PROJECT_CATEGORIES = [
  'Web App',
  'Full Stack',
  'Frontend',
  'Backend',
  'Dashboard',
  'E-Commerce',
  'SaaS',
  'Mobile',
  'Other',
]

export const PROJECT_STATUSES = ['Completed', 'In Progress', 'Coming Soon']

export const PROJECT_BADGES = [
  { value: '', label: 'None' },
  { value: 'New', label: 'New' },
  { value: 'Featured', label: 'Featured' },
  { value: 'Client Project', label: 'Client Project' },
  { value: 'Personal Project', label: 'Personal Project' },
]

export const EMPTY_PROJECT_FORM = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  coverImage: '',
  galleryImages: [],
  category: 'Web App',
  techStack: [],
  githubUrl: '',
  liveUrl: '',
  projectStatus: 'Completed',
  featured: false,
  published: false,
  displayOrder: 0,
  badge: '',
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  },
}

export function slugifyTitle(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
