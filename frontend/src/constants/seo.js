/** Site-wide SEO defaults — override per route via SeoHead */

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://ahmadstack.dev'

export const SITE_NAME = 'Ahmad Stack'

export const DEFAULT_AUTHOR = 'Syed Ahmad Mohayyudin'

export const GITHUB_URL = 'https://github.com/samagenticai'

export const HOME_TITLE =
  'Ahmad Stack | MERN Stack Developer | React.js | Node.js | Full Stack Web Developer'

export const HOME_DESCRIPTION =
  'Professional MERN Stack Developer specializing in React.js, Node.js, Express.js and MongoDB. Explore Ahmad Stack — projects, responsive websites, modern UI/UX designs and full-stack web applications.'

export const SEO_KEYWORDS = [
  'MERN Stack Developer',
  'Full Stack Developer',
  'React Developer',
  'Node.js Developer',
  'JavaScript Developer',
  'Frontend Developer',
  'Backend Developer',
  'MongoDB Developer',
  'Express.js Developer',
  'Tailwind CSS Developer',
  'Next.js Developer',
  'Responsive Web Design',
  'Portfolio Website',
  'Web Developer Pakistan',
  'MERN Developer Pakistan',
  'React Portfolio',
  'Freelance Web Developer',
  'Modern UI Design',
  'API Development',
  'Website Development',
  'Full Stack Portfolio',
  'Software Engineer Portfolio',
  'React Projects',
  'Node.js Projects',
  'MongoDB Projects',
  'JavaScript Portfolio',
].join(', ')

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`

export const PAGE_SEO = {
  home: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: '/',
    ogType: 'website',
  },
  projects: {
    title: 'Projects | Ahmad Stack — MERN Stack Developer',
    description:
      'Browse full-stack MERN projects by Ahmad Stack — React.js frontends, Node.js APIs, MongoDB databases and production-ready web applications.',
    path: '/projects',
    ogType: 'website',
  },
  notFound: {
    title: 'Page Not Found | Ahmad Stack',
    description: 'The page you are looking for could not be found. Return to the Ahmad Stack homepage.',
    robots: 'noindex, follow',
  },
  login: {
    title: 'Admin Login | Ahmad Stack',
    description: 'Secure admin access for Ahmad Stack CMS.',
    path: '/login',
    robots: 'noindex, nofollow',
  },
}

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL
  if (path.startsWith('http')) return path
  return `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
