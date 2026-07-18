import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) return null

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })

  return transporter
}

export async function sendContactNotification(message) {
  const transport = getTransporter()
  if (!transport) {
    console.warn('SMTP not configured — contact message saved but email not sent')
    return { sent: false, reason: 'SMTP not configured' }
  }

  const to =
    process.env.CONTACT_NOTIFY_EMAIL ||
    process.env.ADMIN_EMAIL ||
    process.env.SMTP_USER

  const from = process.env.SMTP_FROM || process.env.SMTP_USER

  await transport.sendMail({
    from,
    to,
    replyTo: message.email,
    subject: `[Portfolio Contact] ${message.subject}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Subject: ${message.subject}`,
      '',
      message.message,
    ].join('\n'),
    html: `
      <h2>New portfolio contact message</h2>
      <p><strong>Name:</strong> ${message.name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Subject:</strong> ${message.subject}</p>
      <hr />
      <p>${String(message.message).replace(/\n/g, '<br/>')}</p>
    `,
  })

  return { sent: true }
}
