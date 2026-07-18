export const JOURNEY_MILESTONES = [
  {
    id: 'start',
    icon: 'rocket',
    title: 'Started Learning Web Development',
    detail: 'Foundations of modern frontend development',
    year: '2025',
    items: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
  },
  {
    id: 'react',
    icon: 'atom',
    title: 'React Development',
    detail: 'Building interactive user interfaces',
    year: '2025',
    items: ['React.js', 'Tailwind CSS', 'Component Architecture'],
  },
  {
    id: 'backend',
    icon: 'server',
    title: 'Backend Development',
    detail: 'Server-side APIs and database integration',
    year: '2025',
    items: ['Node.js', 'Express.js', 'MongoDB', 'REST API', 'JWT Authentication'],
  },
  {
    id: 'mern',
    icon: 'trophy',
    title: 'Building Full Stack MERN Applications',
    detail: 'End-to-end apps with production-ready architecture',
    year: 'Present',
    items: ['React + Node.js + MongoDB', 'Admin CMS & Portfolio', 'Deployment Workflows'],
  },
]

export const JOURNEY_ACHIEVEMENTS = [
  {
    id: 'projects',
    icon: 'trophy',
    title: 'Projects Built',
    value: '12+',
    description: 'Production-grade MERN applications',
    size: 'lg',
    position: 'top-left',
    accent: 'from-primary/20 to-secondary/10',
    floatDelay: '0s',
    iconAnim: 'bounce',
  },
  {
    id: 'technologies',
    icon: 'atom',
    title: 'Technologies Mastered',
    value: '12+',
    description: 'React, Node, MongoDB & modern tooling',
    size: 'md',
    position: 'top-right',
    accent: 'from-cyan-500/15 to-primary/10',
    floatDelay: '0.8s',
    iconAnim: 'spin-slow',
  },
  {
    id: 'deployments',
    icon: 'rocket',
    title: 'Live Deployments',
    value: '10+',
    description: 'Apps shipped to real users',
    size: 'sm',
    position: 'mid-left',
    accent: 'from-green-500/15 to-primary/5',
    floatDelay: '1.4s',
    iconAnim: 'pulse',
  },
  {
    id: 'problem-solving',
    icon: 'lightbulb',
    title: 'Problem Solving',
    value: '100%',
    description: 'Debug-first, solution-driven mindset',
    size: 'xl',
    position: 'mid-right',
    accent: 'from-yellow-500/10 to-primary/10',
    floatDelay: '0.4s',
    iconAnim: 'glow',
  },
  {
    id: 'responsive',
    icon: 'smartphone',
    title: 'Responsive Design',
    value: 'Pixel Perfect',
    description: 'Flawless on every screen size',
    size: 'md',
    position: 'bottom-left',
    accent: 'from-secondary/15 to-primary/10',
    floatDelay: '1.1s',
    iconAnim: 'sway',
  },
  {
    id: 'performance',
    icon: 'zap',
    title: 'Performance Focus',
    value: '98%',
    description: 'Optimized bundles & smooth UX',
    size: 'lg',
    position: 'bottom-right',
    accent: 'from-primary/25 to-cyan-500/10',
    floatDelay: '1.7s',
    iconAnim: 'flash',
  },
]

export const JOURNEY_MISSION = {
  title: 'Current Mission',
  description:
    'Building high-quality MERN applications with clean architecture, responsive UI and production-ready code while preparing for full-time software engineering opportunities.',
}

export const JOURNEY_MISSION_SKILLS = [
  { id: 'frontend', label: 'Frontend', progress: 92 },
  { id: 'backend', label: 'Backend', progress: 88 },
  { id: 'uiux', label: 'UI/UX', progress: 90 },
  { id: 'problem-solving', label: 'Problem Solving', progress: 94 },
  { id: 'deployment', label: 'Deployment', progress: 86 },
]

export const JOURNEY_QUOTE = {
  text: 'Code is read more than it is written — clarity beats cleverness every time.',
  author: 'Developer Philosophy',
}

export const JOURNEY_GIT_ACTIVITY = {
  label: 'Git Activity',
  commits: '480+',
  streak: '12 week streak',
  status: 'Active',
}

export const JOURNEY_DEPLOYMENT_STATUS = {
  label: 'Deployment Status',
  status: 'All Systems Live',
  platforms: ['Vercel', 'Render'],
  uptime: '99.9%',
}

export const JOURNEY_CURRENT_PROJECT = {
  label: 'Current Project',
  name: 'Portfolio CMS & Client Projects',
  progress: 90,
}

export const JOURNEY_AVAILABILITY = {
  label: 'Availability',
  status: 'Open to Opportunities',
  type: 'Full-Time MERN Role',
}

/** Desktop-only absolute positions — never applied below lg */
export const ACHIEVEMENT_POSITIONS = {
  'top-left': 'lg:absolute lg:top-0 lg:left-0 lg:w-[44%]',
  'top-right': 'lg:absolute lg:top-6 lg:right-0 lg:w-[50%]',
  'mid-left': 'lg:absolute lg:top-[36%] lg:left-[4%] lg:w-[40%]',
  'mid-right': 'lg:absolute lg:top-[30%] lg:right-0 lg:w-[48%]',
  'bottom-left': 'lg:absolute lg:bottom-[22%] lg:left-0 lg:w-[43%]',
  'bottom-right': 'lg:absolute lg:bottom-0 lg:right-[2%] lg:w-[47%]',
}

export const EXTRA_POSITIONS = {
  quote: 'lg:absolute lg:top-[14%] lg:left-[38%] lg:w-[34%] lg:z-10',
  git: 'lg:absolute lg:bottom-[36%] lg:left-[36%] lg:w-[30%] lg:z-10',
  deployment: 'lg:absolute lg:top-[52%] lg:right-[32%] lg:w-[28%] lg:z-10',
  project: 'lg:absolute lg:bottom-[8%] lg:left-[34%] lg:w-[32%] lg:z-10',
  availability: 'lg:absolute lg:top-[2%] lg:right-[28%] lg:w-auto lg:z-20',
}

export const PANEL_SIZE_CLASSES = {
  sm: 'p-3.5 sm:p-4 lg:p-3.5',
  md: 'p-4 sm:p-5 lg:p-4',
  lg: 'p-4 sm:p-5 lg:p-5',
  xl: 'p-4 sm:p-5 lg:p-6',
}

export const PANEL_VALUE_CLASSES = {
  sm: 'text-lg sm:text-xl',
  md: 'text-xl sm:text-2xl',
  lg: 'text-xl sm:text-2xl lg:text-3xl',
  xl: 'text-xl sm:text-2xl lg:text-4xl',
}
