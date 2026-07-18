import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDB, disconnectDB } from '../src/config/db.js'
import { Admin } from '../src/models/Admin.js'

const TEST_PASSWORD = 'VerifyPass1!'
const ORIGINAL = process.env.ADMIN_PASSWORD

async function login(email, password) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, rememberMe: false }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

async function changePassword(token, body) {
  const res = await fetch('http://localhost:5000/api/auth/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

async function main() {
  const email = process.env.ADMIN_EMAIL
  if (!email || !ORIGINAL) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD required in .env')

  await connectDB()

  console.log('1) Login with current password…')
  const firstLogin = await login(email, ORIGINAL)
  if (!firstLogin.ok) throw new Error(`Initial login failed: ${firstLogin.data.message}`)
  const token = firstLogin.data.token
  console.log('   ✅ Current password works')

  console.log('2) Change password via API…')
  const changed = await changePassword(token, {
    currentPassword: ORIGINAL,
    newPassword: TEST_PASSWORD,
    confirmPassword: TEST_PASSWORD,
  })
  if (!changed.ok) throw new Error(`Change failed: ${changed.data.message}`)
  console.log('   ✅', changed.data.message)

  const admin = await Admin.findOne({ email }).select('+passwordHash')
  if (!admin?.passwordHash?.startsWith('$2')) throw new Error('Password hash missing in database')
  const hashOk = await bcrypt.compare(TEST_PASSWORD, admin.passwordHash)
  if (!hashOk) throw new Error('New password not stored as bcrypt hash')
  console.log('   ✅ Password stored as bcrypt hash in Atlas')

  console.log('3) Old password must fail…')
  const oldLogin = await login(email, ORIGINAL)
  if (oldLogin.ok) throw new Error('Old password still works')
  console.log('   ✅ Old password rejected')

  console.log('4) New password must work…')
  const newLogin = await login(email, TEST_PASSWORD)
  if (!newLogin.ok) throw new Error(`New password login failed: ${newLogin.data.message}`)
  console.log('   ✅ New password works immediately')

  console.log('5) Restore original password…')
  const restored = await changePassword(newLogin.data.token, {
    currentPassword: TEST_PASSWORD,
    newPassword: ORIGINAL,
    confirmPassword: ORIGINAL,
  })
  if (!restored.ok) throw new Error(`Restore failed: ${restored.data.message}`)
  console.log('   ✅ Original password restored')

  console.log('\n✅ Password change verification complete\n')
  await disconnectDB()
}

main().catch(async (err) => {
  console.error('\n❌', err.message, '\n')
  await disconnectDB()
  process.exit(1)
})
