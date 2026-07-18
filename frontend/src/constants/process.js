export const PROCESS_STEPS = [
  {
    id: 'research',
    step: '01',
    title: 'Research & Planning',
    description:
      'I clarify goals, map user needs, and define architecture before a single line of code is written.',
    icon: 'lightbulb',
    accent: 'from-amber-500/20 to-primary/10',
    side: 'left',
    variant: 'wide',
    satellite: 'plan',
    detail: 'User stories · Scope · Tech decisions',
  },
  {
    id: 'design',
    step: '02',
    title: 'UI / UX Design',
    description:
      'Interfaces are structured for clarity first — hierarchy, spacing, and interaction patterns that feel intentional.',
    icon: 'palette',
    accent: 'from-fuchsia-500/15 to-secondary/10',
    side: 'right',
    variant: 'tall',
    satellite: 'wireframe',
    detail: 'Wireframes · Visual system · Accessibility',
  },
  {
    id: 'frontend',
    step: '03',
    title: 'Frontend Development',
    description:
      'I build responsive, component-driven interfaces with React — clean state, reusable UI, and smooth interactions.',
    icon: 'atom',
    accent: 'from-sky-500/20 to-primary/10',
    side: 'left',
    variant: 'code',
    satellite: 'snippet',
    detail: 'React · Tailwind · GSAP',
  },
  {
    id: 'backend',
    step: '04',
    title: 'Backend Development',
    description:
      'APIs are designed for reliability — clear routes, validation, authentication, and predictable error handling.',
    icon: 'server',
    accent: 'from-emerald-500/15 to-primary/10',
    side: 'right',
    variant: 'api',
    satellite: 'api',
    detail: 'Node · Express · REST',
  },
  {
    id: 'database',
    step: '05',
    title: 'Database Integration',
    description:
      'Data models are shaped for real usage — indexing, relationships, and queries that stay fast as the product grows.',
    icon: 'database',
    accent: 'from-lime-500/15 to-secondary/10',
    side: 'left',
    variant: 'compact',
    satellite: 'schema',
    detail: 'MongoDB · Schemas · Indexes',
  },
  {
    id: 'testing',
    step: '06',
    title: 'Testing & Debugging',
    description:
      'I verify edge cases early — catch regressions, fix root causes, and keep the product stable under real conditions.',
    icon: 'bug',
    accent: 'from-rose-500/15 to-primary/10',
    side: 'right',
    variant: 'wide',
    satellite: 'checks',
    detail: 'Edge cases · Logs · Fixes',
  },
  {
    id: 'deploy',
    step: '07',
    title: 'Deployment',
    description:
      'Shipping means production readiness — environment config, build pipelines, and zero-drama releases.',
    icon: 'rocket',
    accent: 'from-violet-500/15 to-secondary/10',
    side: 'left',
    variant: 'badge',
    satellite: 'deploy',
    detail: 'CI/CD · Env · Monitoring',
  },
  {
    id: 'optimize',
    step: '08',
    title: 'Optimization & Maintenance',
    description:
      'After launch I refine performance, tighten DX, and keep the system healthy as features evolve.',
    icon: 'gauge',
    accent: 'from-cyan-500/15 to-primary/10',
    side: 'right',
    variant: 'tall',
    satellite: 'perf',
    detail: 'Lighthouse · Caching · Iteration',
  },
]

export const PROCESS_PHILOSOPHY =
  'Every product ships through a deliberate loop — plan carefully, build cleanly, verify thoroughly, and improve continuously.'
