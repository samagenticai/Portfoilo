import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDB, disconnectDB, getDbStatus, isDbConnected } from '../src/config/db.js'
import { validateEnv } from '../src/config/env.js'
import { Admin } from '../src/models/Admin.js'
import { Project } from '../src/models/Project.js'
import { Skill } from '../src/models/Skill.js'
import { Profile } from '../src/models/Profile.js'
import { Resume } from '../src/models/Resume.js'
import { ContactMessage } from '../src/models/ContactMessage.js'

const TEST_TAG = '__atlas_verify__'

function pass(label) {
  console.log(`  ✅ ${label}`)
}

function fail(label, err) {
  console.error(`  ❌ ${label}: ${err?.message || err}`)
  throw err
}

async function verifyAuthentication() {
  const count = await Admin.countDocuments()
  pass(`Authentication (admins collection) — ${count} admin record(s)`)
  return count
}

async function verifyProjectsCrud() {
  const created = await Project.create({
    title: `${TEST_TAG} Project`,
    slug: `${TEST_TAG}-project-${Date.now()}`,
    shortDescription: 'Atlas verification project',
    published: false,
  })
  pass(`Projects CREATE — id ${created._id}`)

  const found = await Project.findById(created._id)
  if (!found) fail('Projects READ')
  pass('Projects READ')

  found.shortDescription = 'Updated via Atlas verification'
  await found.save()
  pass('Projects UPDATE')

  await Project.findByIdAndDelete(created._id)
  pass('Projects DELETE')
}

async function verifySkillsCrud() {
  const created = await Skill.create({
    name: `${TEST_TAG} Skill`,
    slug: `${TEST_TAG}-skill-${Date.now()}`,
    category: 'Backend',
    percentage: 50,
    published: false,
  })
  pass(`Skills CREATE — id ${created._id}`)

  const found = await Skill.findById(created._id)
  if (!found) fail('Skills READ')
  pass('Skills READ')

  found.percentage = 75
  await found.save()
  pass('Skills UPDATE')

  await Skill.findByIdAndDelete(created._id)
  pass('Skills DELETE')
}

async function verifyProfileCrud() {
  let profile = await Profile.findOne({ key: 'portfolio' })
  if (!profile) {
    profile = await Profile.create({ key: 'portfolio' })
    pass('Profile CREATE (default portfolio record)')
  } else {
    pass('Profile READ (existing portfolio record)')
  }

  const previous = profile.fullName
  profile.fullName = `${TEST_TAG} Profile Test`
  await profile.save()
  pass('Profile UPDATE')

  profile.fullName = previous
  await profile.save()
  pass('Profile UPDATE (restored)')
}

async function verifyResumeCrud() {
  let resume = await Resume.findOne({ key: 'portfolio' })
  if (!resume) {
    resume = await Resume.create({ key: 'portfolio' })
    pass('Resume CREATE (default portfolio record)')
  } else {
    pass('Resume READ (existing portfolio record)')
  }

  const previous = resume.fileName
  resume.fileName = `${TEST_TAG}-resume.pdf`
  await resume.save()
  pass('Resume UPDATE')

  resume.fileName = previous
  await resume.save()
  pass('Resume UPDATE (restored)')
}

async function verifyMessagesCrud() {
  const created = await ContactMessage.create({
    name: `${TEST_TAG} User`,
    email: 'verify@example.com',
    subject: `${TEST_TAG} subject line`,
    message: 'Atlas verification message with enough length for validation.',
    read: false,
  })
  pass(`Messages CREATE — id ${created._id}`)

  const found = await ContactMessage.findById(created._id)
  if (!found) fail('Messages READ')
  pass('Messages READ')

  found.read = true
  await found.save()
  pass('Messages UPDATE')

  await ContactMessage.findByIdAndDelete(created._id)
  pass('Messages DELETE')
}

async function main() {
  console.log('\n🔍 MongoDB Atlas verification\n')

  validateEnv()

  const connected = await connectDB()
  if (!connected || !isDbConnected()) {
    console.error('\n❌ Could not connect to MongoDB Atlas. Check MONGO_URI in backend/.env\n')
    process.exit(1)
  }

  const db = getDbStatus()
  console.log(`Connected to Atlas database: ${db.name} (${db.host})\n`)

  await verifyAuthentication()
  await verifyProjectsCrud()
  await verifySkillsCrud()
  await verifyProfileCrud()
  await verifyResumeCrud()
  await verifyMessagesCrud()

  console.log('\n✅ All MongoDB Atlas CRUD checks passed\n')
  await disconnectDB()
}

main().catch((err) => {
  console.error('\n❌ Verification failed:', err.message, '\n')
  disconnectDB().finally(() => process.exit(1))
})
