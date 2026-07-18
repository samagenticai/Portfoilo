export const HERO_ORBIT = [
  { id: 'react', name: 'React', radius: 82, duration: 24, direction: 1, startAngle: 0 },
  { id: 'nodejs', name: 'Node.js', radius: 92, duration: 30, direction: -1, startAngle: 38 },
  { id: 'express', name: 'Express.js', radius: 76, duration: 22, direction: 1, startAngle: 78 },
  { id: 'mongodb', name: 'MongoDB', radius: 98, duration: 34, direction: -1, startAngle: 120 },
  { id: 'tailwind', name: 'Tailwind CSS', radius: 86, duration: 26, direction: 1, startAngle: 165 },
  { id: 'git', name: 'Git', radius: 72, duration: 20, direction: -1, startAngle: 210 },
  { id: 'github', name: 'GitHub', radius: 88, duration: 28, direction: 1, startAngle: 255 },
  { id: 'javascript', name: 'JavaScript', radius: 94, duration: 32, direction: -1, startAngle: 300 },
  { id: 'typescript', name: 'TypeScript', radius: 80, duration: 27, direction: 1, startAngle: 340 },
]

export const FLOATING_COMMANDS = [
  { text: 'git push origin main', left: '6%', top: '14%', opacity: 0.045, duration: 24, x: 12, y: 10 },
  { text: 'npm install', left: '72%', top: '10%', opacity: 0.038, duration: 28, x: -10, y: 14 },
  { text: 'npm run dev', left: '8%', top: '58%', opacity: 0.052, duration: 22, x: 14, y: -8 },
  { text: 'Deployment Successful', left: '58%', top: '72%', opacity: 0.04, duration: 30, x: -12, y: 12 },
  { text: 'MongoDB Connected', left: '38%', top: '32%', opacity: 0.035, duration: 26, x: 8, y: -14 },
]

export const STATUS_ITEMS = [
  { id: 'mongo', label: 'MongoDB Connected', type: 'status', value: 'Connected' },
  { id: 'backend', label: 'Backend Online', type: 'status', value: 'Online' },
  { id: 'api', label: 'API Running', type: 'status', value: 'Active' },
  { id: 'deploy', label: 'Deployment Ready', type: 'status', value: 'Ready' },
  { id: 'perf', label: 'Performance Score', type: 'metric', min: 96, max: 100, suffix: '%' },
  { id: 'fps', label: 'FPS', type: 'metric', min: 58, max: 60, suffix: '' },
  { id: 'response', label: 'Response Time', type: 'metric', min: 18, max: 42, suffix: 'ms' },
]
