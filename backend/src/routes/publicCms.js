import { Router } from 'express'
import { Skill } from '../models/Skill.js'
import { Profile } from '../models/Profile.js'
import { Resume } from '../models/Resume.js'
import {
  sortSkills,
  skillsToOrbit,
  skillsToProficiency,
  toPublicProfile,
  toPublicResume,
  toPublicSkill,
} from '../utils/cmsMapper.js'

const router = Router()

router.get('/skills', async (_req, res) => {
  try {
    const items = await Skill.find({ published: true }).lean()
    const skills = sortSkills(items).map(toPublicSkill)
    res.set('Cache-Control', 'no-store')
    res.json({
      skills,
      orbit: skillsToOrbit(skills),
      proficiency: skillsToProficiency(skills),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load skills' })
  }
})

router.get('/profile', async (_req, res) => {
  try {
    const profile = await Profile.findOne({ key: 'portfolio' }).lean()
    if (!profile) return res.status(404).json({ message: 'Profile not found' })
    res.set('Cache-Control', 'no-store')
    res.json({ profile: toPublicProfile(profile) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load profile' })
  }
})

router.get('/resume', async (_req, res) => {
  try {
    const resume = await Resume.findOne({ key: 'portfolio' }).lean()
    res.set('Cache-Control', 'no-store')
    res.json({ resume: toPublicResume(resume) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to load resume' })
  }
})

export default router
