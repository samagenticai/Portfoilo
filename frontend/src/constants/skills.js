export const ORBIT_TECH = [
  { id: 'react', name: 'React', radius: 118, duration: 28, direction: 1, startAngle: 0 },
  { id: 'nodejs', name: 'Node.js', radius: 132, duration: 34, direction: -1, startAngle: 45 },
  { id: 'express', name: 'Express.js', radius: 108, duration: 24, direction: 1, startAngle: 90 },
  { id: 'mongodb', name: 'MongoDB', radius: 142, duration: 38, direction: -1, startAngle: 135 },
  { id: 'tailwind', name: 'Tailwind CSS', radius: 125, duration: 30, direction: 1, startAngle: 180 },
  { id: 'javascript', name: 'JavaScript', radius: 115, duration: 26, direction: -1, startAngle: 210 },
  { id: 'typescript', name: 'TypeScript', radius: 138, duration: 32, direction: 1, startAngle: 250 },
  { id: 'git', name: 'Git', radius: 110, duration: 22, direction: -1, startAngle: 290 },
  { id: 'github', name: 'GitHub', radius: 128, duration: 36, direction: 1, startAngle: 320 },
  { id: 'vercel', name: 'Vercel', radius: 120, duration: 27, direction: -1, startAngle: 15 },
  { id: 'render', name: 'Render', radius: 135, duration: 33, direction: 1, startAngle: 55 },
  { id: 'postman', name: 'Postman', radius: 112, duration: 25, direction: -1, startAngle: 105 },
  { id: 'vscode', name: 'VS Code', radius: 145, duration: 40, direction: 1, startAngle: 165 },
]

export const TECH_META = {
  react: { description: 'Component-driven UI library for dynamic interfaces.' },
  javascript: { description: 'Core language powering the modern web.' },
  typescript: { description: 'Typed superset for scalable JavaScript codebases.' },
  tailwind: { description: 'Utility-first CSS for rapid, consistent styling.' },
  nodejs: { description: 'JavaScript runtime for scalable server-side apps.' },
  express: { description: 'Minimal Node.js framework for REST APIs.' },
  mongodb: { description: 'Flexible NoSQL database for modern applications.' },
  git: { description: 'Version control for collaborative development.' },
  github: { description: 'Cloud platform for code hosting and CI/CD.' },
  vscode: { description: 'Powerful editor for productive development.' },
  postman: { description: 'API testing and documentation toolkit.' },
  vercel: { description: 'Edge deployment platform for frontend apps.' },
  render: { description: 'Cloud hosting for web services and APIs.' },
}

export const LIVE_CODE = `const developer = {
  name: "Syed Ahmad Mohayyudin",
  role: "MERN Stack Developer",
  frontend: ["React", "Next.js", "Tailwind CSS"],
  backend: ["Node.js", "Express.js"],
  database: ["MongoDB"],
  deployment: ["Vercel", "Render"],
  passion: "Building Modern Web Applications"
};`

export const SKILLS_DEV_CODE = `const developer = {
  name: "Syed Ahmad Mohayyudin",
  role: "MERN Stack Developer",
  status: "Available",
  passion: "Building Modern Web Applications"
};`

export const SKILLS_ANALYTICS_METRICS = [
  {
    id: 'projects',
    label: 'Projects',
    value: 12,
    suffix: '+',
    progress: 88,
    icon: 'folder',
  },
  {
    id: 'tech',
    label: 'Technologies',
    value: 12,
    suffix: '+',
    progress: 92,
    icon: 'stack',
  },
  {
    id: 'deploy',
    label: 'Deployments',
    value: 10,
    suffix: '+',
    progress: 82,
    icon: 'rocket',
  },
  {
    id: 'perf',
    label: 'Performance',
    value: 98,
    suffix: '%',
    progress: 98,
    icon: 'bolt',
  },
  {
    id: 'available',
    label: 'Available for Work',
    progress: 100,
    icon: 'star',
    status: true,
  },
]

export const SKILLS_PROFICIENCY = [
  { id: 'react', label: 'React', level: 92 },
  { id: 'nodejs', label: 'Node.js', level: 88 },
  { id: 'mongodb', label: 'MongoDB', level: 85 },
  { id: 'express', label: 'Express.js', level: 87 },
  { id: 'tailwind', label: 'Tailwind CSS', level: 90 },
]

export const SKILLS_QUICK_STATS = [
  { id: 'commits', label: 'GitHub Commits', value: '480+', icon: 'git' },
  { id: 'uptime', label: 'Uptime', value: '99.9%', icon: 'server' },
  { id: 'response', label: 'API Response', value: '120ms', icon: 'bolt' },
]

export const SKILLS_FOCUS = {
  project: 'Cricket Tournament Management',
  stack: ['React', 'Node.js', 'MongoDB', 'Express'],
  status: 'Active Development',
  progress: 90,
}
