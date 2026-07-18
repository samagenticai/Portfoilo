import app from '../backend/src/app.js'
import { connectDB, isDbConnected } from '../backend/src/config/db.js'
import { seedAdmin } from '../backend/src/utils/seedAdmin.js'

const connected = await connectDB()
if (connected && isDbConnected()) {
  await seedAdmin()
}

export default app
