# Quick Start: Production Deployment Checklist

## Pre-Deployment Checklist

### 1. Code Ready
- [ ] Code committed and pushed to Git
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors
- [ ] No linting errors

### 2. Database Setup
- [ ] Neon production database created
- [ ] Connection string copied
- [ ] Database migrations ready (`prisma migrate dev` completed locally)

### 3. AWS Setup
- [ ] S3 bucket created
- [ ] IAM user created with S3 permissions
- [ ] Access key ID and secret key saved
- [ ] (Optional) SES configured for emails

### 4. Vercel Setup
- [ ] Account created at [vercel.com](https://vercel.com)
- [ ] Repository connected to Vercel
- [ ] Project imported

---

## Environment Variables to Set in Vercel

Go to: **Project Settings → Environment Variables**

### Required (Production)

```bash
# Database - MUST use pooler connection string (has -pooler in hostname)
DATABASE_URL="postgresql://user:pass@host-pooler.region.aws.neon.tech/db?sslmode=require"
# ⚠️ Get this from Neon Dashboard → Connection Details → Connection Pooling tab

# Auth (generate secret: openssl rand -base64 32)
AUTH_SECRET="your-generated-secret-here"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET_NAME="your-bucket-name"
```

### Optional (Email)

```bash
AWS_SES_REGION="us-east-1"
AWS_SES_ACCESS_KEY_ID="your-key"
AWS_SES_SECRET_ACCESS_KEY="your-secret"
AWS_SES_FROM_EMAIL="noreply@yourdomain.com"
```

---

## Deployment Steps

1. **Set Environment Variables** in Vercel dashboard
2. **Click Deploy** (or push to main branch)
3. **Wait for build** to complete
4. **Run migrations:**
   ```bash
   vercel link
   vercel env pull .env.local
   npx prisma migrate deploy
   ```
5. **Test your deployment:**
   - Visit the Vercel URL
   - Test signup/login
   - Verify file uploads work

---

## Common Issues

**Build fails:**
- Check all env vars are set
- Verify `DATABASE_URL` is correct
- Check build logs in Vercel

**"No tenant context" error:**
- For localhost: Use `?tenant=subdomain` in URL
- For production: Set up subdomain routing or use query params

**Database connection fails:**
- Verify `DATABASE_URL` uses pooler connection (Neon provides this)
- Check database is running in Neon dashboard

**S3 upload fails:**
- Verify AWS credentials are correct
- Check IAM user has S3 permissions
- Verify bucket name matches exactly

---

## Post-Deployment

- [ ] Test signup flow
- [ ] Test login flow  
- [ ] Test file uploads
- [ ] Test PDF generation
- [ ] Verify multi-tenancy works
- [ ] Check error logs in Vercel

---

## Need Help?

See `DEPLOYMENT.md` for detailed instructions.

