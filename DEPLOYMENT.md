# Production Deployment Checklist

Deploy as **one Vercel project** (recommended): frontend static files + `/api` serverless Express + MongoDB Atlas.

## 1. MongoDB Atlas

- [ ] Create a free/paid cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- [ ] Create a database user with read/write access
- [ ] Allow network access: `0.0.0.0/0` (or Vercel IP ranges if restricted)
- [ ] Copy connection string → `MONGO_URI`

## 2. Vercel Project

- [ ] Import the GitHub repo into [Vercel](https://vercel.com)
- [ ] Root directory: repository root (contains `vercel.json`)
- [ ] Framework preset: **Other**
- [ ] Build command: `npm run build --prefix frontend` (auto from `vercel.json`)
- [ ] Output directory: `frontend/dist` (auto from `vercel.json`)

## 3. Cloudinary (file uploads)

- [ ] Create a free account at [Cloudinary](https://cloudinary.com)
- [ ] Copy **Cloud name**, **API Key**, and **API Secret** from the dashboard
- [ ] Add to Vercel environment variables (see below)

## 4. Environment Variables (Vercel Dashboard)

| Variable | Required | Notes |
|----------|----------|-------|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Long random string (32+ chars) |
| `CLIENT_URL` | Yes | `https://your-domain.vercel.app` or custom domain |
| `NODE_ENV` | Yes | `production` |
| `ADMIN_EMAIL` | Yes | Admin login email (seeded once) |
| `ADMIN_PASSWORD` | Yes | Strong password (seeded once) |
| `ADMIN_NAME` | No | Display name |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `SMTP_HOST` | For email | Contact form notifications |
| `SMTP_PORT` | For email | Usually `587` |
| `SMTP_SECURE` | For email | `false` for STARTTLS |
| `SMTP_USER` | For email | SMTP username |
| `SMTP_PASS` | For email | SMTP password |
| `SMTP_FROM` | For email | Sender address |
| `CONTACT_NOTIFY_EMAIL` | For email | Where contact messages go |
| `VITE_SITE_URL` | Yes | Same as production domain (build-time) |
| `ALLOWED_ORIGINS` | Optional | Extra CORS origins, comma-separated |

**Frontend build-time:** Set `VITE_SITE_URL` in Vercel env vars before deploying.

## 5. Post-deploy verification

- [ ] `GET /api/health` returns `{ status: "ok" }`
- [ ] Homepage loads with profile/skills from API
- [ ] Admin login works (`/login`)
- [ ] Project CRUD + image upload works
- [ ] Skill icon upload works
- [ ] Profile image upload works
- [ ] Resume PDF upload + download works
- [ ] Contact form saves message + sends email
- [ ] SEO meta tags present (view source / Lighthouse)
- [ ] Mobile responsive layout unchanged

## 6. Custom domain

- [ ] Add domain in Vercel → Domains
- [ ] Update `CLIENT_URL`, `VITE_SITE_URL`, and redeploy
- [ ] Submit sitemap: `https://your-domain.com/sitemap.xml` to Google Search Console

## Local development

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Split deployment (optional)

If frontend and backend are **separate** Vercel projects:

1. Deploy backend project with API only
2. Set frontend `VITE_API_URL=https://your-api.vercel.app`
3. Set backend `CLIENT_URL=https://your-frontend.vercel.app`
4. Set backend `COOKIE_CROSS_SITE=true`

JWT bearer auth works cross-domain; cookies require `COOKIE_CROSS_SITE=true`.
