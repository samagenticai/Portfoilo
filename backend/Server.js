import app from './src/app.js'
import { connectDB } from './src/config/db.js'
import { seedAdmin } from './src/utils/seedAdmin.js'
import { seedPortfolio } from './src/utils/seedPortfolio.js'

const PORT = process.env.PORT || 5000

async function start() {
  const connected = await connectDB()

  if (connected) {
    await seedAdmin()
    await seedPortfolio()
  } else {
    console.error(
      '❌ MongoDB Atlas is unavailable — server started but API routes will return 503 until Atlas connects',
    )
  }

  app.listen(PORT)
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
