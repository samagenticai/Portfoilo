import slugify from 'slugify'
import { Profile } from '../models/Profile.js'
import { Resume } from '../models/Resume.js'
import { Skill } from '../models/Skill.js'

const DEFAULT_PROFILE = {
  key: 'portfolio',
  fullName: 'Syed Ahmad Mohayyudin',
  professionalTitle: 'MERN Stack Developer',
  animatedTitles: [
    'React Developer',
    'Node.js Developer',
    'MERN Stack Developer',
    'Full Stack Developer',
  ],
  shortBio:
    'MERN Stack Developer building modern, scalable web applications with clean code and polished UX.',
  heroDescription:
    'I craft scalable full-stack applications with the MERN stack — clean architecture, polished interfaces, and performance that feels effortless.',
  location: 'Multan, Pakistan',
  email: 'syedahmadmohayyudin@gmail.com',
  phone: '+92 313 7363725',
  phoneE164: '923137363725',
  githubUrl: 'https://github.com/samagenticai',
  githubDisplay: 'github.com/samagenticai',
  linkedinUrl: 'https://www.linkedin.com/in/syed-ahmad-mohayyudin-bukhri-003b9b38b',
  linkedinDisplay: 'linkedin.com/in/syed-ahmad-mohayyudin-bukhri',
  website: '',
  yearsOfExperience: 2,
  availability: 'Available for Full-Time MERN Stack Developer Opportunities',
  skillsHeading: 'Technologies I Use to Build Modern Web Applications',
  skillsDescription:
    'I specialize in building fast, scalable and responsive web applications using the MERN Stack and modern frontend technologies.',
  skillsDescription2:
    'I focus on writing clean code, creating exceptional user experiences and delivering production-ready applications.',
}

const DEFAULT_SKILLS = [
  { name: 'React', category: 'Frontend', percentage: 92, lucideIcon: 'atom', displayOrder: 1 },
  { name: 'Node.js', category: 'Backend', percentage: 88, lucideIcon: 'server', displayOrder: 2 },
  { name: 'MongoDB', category: 'Database', percentage: 85, lucideIcon: 'database', displayOrder: 3 },
  { name: 'Express.js', category: 'Backend', percentage: 87, lucideIcon: 'waypoints', displayOrder: 4 },
  { name: 'Tailwind CSS', category: 'Frontend', percentage: 90, lucideIcon: 'layout-template', displayOrder: 5 },
  { name: 'JavaScript', category: 'Frontend', percentage: 90, lucideIcon: 'file-code-2', displayOrder: 6 },
  { name: 'TypeScript', category: 'Frontend', percentage: 82, lucideIcon: 'file-code-2', displayOrder: 7 },
  { name: 'Git', category: 'Tools', percentage: 88, lucideIcon: 'git-branch', displayOrder: 8 },
  { name: 'GitHub', category: 'Tools', percentage: 90, lucideIcon: 'folder-git-2', displayOrder: 9 },
  { name: 'Vercel', category: 'Tools', percentage: 85, lucideIcon: 'triangle', displayOrder: 10 },
  { name: 'Postman', category: 'Tools', percentage: 86, lucideIcon: 'box', displayOrder: 11 },
  { name: 'VS Code', category: 'Tools', percentage: 95, lucideIcon: 'code-2', displayOrder: 12 },
]

function skillSlug(name) {
  return slugify(name, { lower: true, strict: true })
}

export async function seedPortfolio() {
  const profileExists = await Profile.exists({ key: 'portfolio' })
  if (!profileExists) {
    await Profile.create(DEFAULT_PROFILE)
  }

  const skillCount = await Skill.countDocuments()
  if (skillCount === 0) {
    await Skill.insertMany(
      DEFAULT_SKILLS.map((skill) => ({
        ...skill,
        slug: skillSlug(skill.name),
        published: true,
        iconType: 'lucide',
      })),
    )
  }

  const resumeExists = await Resume.exists({ key: 'portfolio' })
  if (!resumeExists) {
    await Resume.create({ key: 'portfolio' })
  }
}
