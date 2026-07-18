import 'dotenv/config'
import { connectDB } from '../config/db.js'
import { Project } from '../models/Project.js'

/** Removes the original seeded demo projects so only CMS-created work remains. */
const DEMO_SLUGS = ['cricket-tournament', 'ecommerce-platform', 'taskflow']

async function clearDemoProjects() {
  await connectDB()
  const result = await Project.deleteMany({ slug: { $in: DEMO_SLUGS } })
  console.log(`Removed ${result.deletedCount} demo project(s)`)
  process.exit(0)
}

clearDemoProjects().catch((err) => {
  console.error(err)
  process.exit(1)
})
