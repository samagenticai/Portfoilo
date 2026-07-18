import 'dotenv/config'
import { connectDB } from '../config/db.js'
import { seedAdmin } from './seedAdmin.js'

await connectDB()
await seedAdmin()
process.exit(0)
