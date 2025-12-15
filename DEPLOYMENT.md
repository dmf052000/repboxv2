# Production Deployment Guide - RepBox CRM

This guide walks you through deploying RepBox CRM to production on Vercel.

## Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub/GitLab/Bitbucket repository with your code
- ✅ A Neon PostgreSQL database (production instance)
- ✅ AWS S3 bucket created and configured
- ✅ AWS IAM user with S3 permissions
- ✅ AWS SES configured (optional, for email)
- ✅ Domain name (optional, for custom domain)

---

## Step 1: Prepare Your Code

1. **Ensure your code is committed and pushed to Git:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Verify build works locally:**
   ```bash
   npm run build
   ```
   If the build fails, fix any errors before proceeding.

---

## Step 2: Set Up Vercel Account

1. **Create Vercel Account:**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended) or email
   - Complete onboarding

2. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm install -g vercel
   ```

---

## Step 3: Import Project to Vercel

1. **In Vercel Dashboard:**
   - Click "Add New" → "Project"
   - Import your Git repository
   - Select the repository containing RepBox

2. **Configure Project Settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./repbox` (if your project is in a subdirectory) or `./` (if at root)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

3. **Click "Deploy"** (we'll add environment variables next)

---

## Step 4: Configure Environment Variables

Go to your project in Vercel → **Settings** → **Environment Variables** and add:

### Required Variables

```env
# Database (from Neon)
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# NextAuth.js v5 (uses AUTH_SECRET automatically)
AUTH_SECRET="generate-with-openssl-rand-base64-32"
# Note: NextAuth v5 automatically reads AUTH_SECRET from environment

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="your-bucket-name"
```

### Optional Variables (for email)

```env
# AWS SES (if using email notifications)
AWS_SES_REGION="us-east-1"
AWS_SES_ACCESS_KEY_ID="your-ses-access-key-id"
AWS_SES_SECRET_ACCESS_KEY="your-ses-secret-access-key"
AWS_SES_FROM_EMAIL="noreply@yourdomain.com"
```

### How to Generate AUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

**Important:** Use a different `AUTH_SECRET` for production than development.

### Setting Variables for Different Environments

In Vercel, you can set variables for:
- **Production** - Used for production deployments
- **Preview** - Used for preview deployments (PRs)
- **Development** - Used for local development (via Vercel CLI)

Set all variables for **Production** environment.

---

## Step 5: Configure Build Settings

1. **Go to Settings → General**

2. **Add Build Command** (if needed):
   - Vercel should auto-detect Next.js, but verify:
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Post-Install Script** (for Prisma):
   - In **Settings → Build & Development Settings**
   - Add to **Install Command**: `npm install && npx prisma generate`
   - Or create a `postinstall` script in `package.json`:
     ```json
     "scripts": {
       "postinstall": "prisma generate"
     }
     ```

---

## Step 6: Run Database Migrations

After your first deployment, you need to run Prisma migrations:

### Option 1: Via Vercel CLI (Recommended)

1. **Install Vercel CLI locally:**
   ```bash
   npm install -g vercel
   ```

2. **Link your project:**
   ```bash
   cd repbox
   vercel link
   ```

3. **Pull environment variables:**
   ```bash
   vercel env pull .env.local
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: Via Vercel Build Command

Add to `package.json`:
```json
{
  "scripts": {
    "postbuild": "prisma migrate deploy"
  }
}
```

**Note:** This runs migrations on every build. Use Option 1 for better control.

---

## Step 7: Configure Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Click "Add Domain"
   - Enter your domain (e.g., `app.repbox.app`)

2. **Update DNS Records:**
   - Follow Vercel's instructions to add DNS records
   - Usually requires adding a CNAME record

3. **Note on NextAuth v5:**
   - NextAuth v5 automatically detects the domain from the request
   - No need to set `NEXTAUTH_URL` (it's optional in v5)
   - If you need to override, you can set `AUTH_URL` environment variable

---

## Step 8: Configure Multi-Tenancy for Production

Your middleware handles subdomain resolution. For production:

1. **If using custom domain:**
   - Set up wildcard DNS: `*.repbox.app` → Vercel
   - Each tenant gets: `tenant1.repbox.app`, `tenant2.repbox.app`, etc.

2. **If using Vercel subdomain:**
   - You'll need to use query parameters: `?tenant=subdomain`
   - Or configure custom domains per tenant

3. **Update Middleware** (if needed):
   - Check `src/middleware.ts` handles your domain structure
   - For localhost development, it uses query params
   - For production subdomains, it extracts from hostname

---

## Step 9: Verify Deployment

1. **Check Deployment Status:**
   - Go to **Deployments** tab in Vercel
   - Wait for build to complete (should show "Ready")

2. **Test Your Application:**
   - Visit your deployment URL
   - Test signup/login flow
   - Verify database connections work
   - Test file uploads (S3 integration)

3. **Check Logs:**
   - Go to **Deployments** → Click on deployment → **Logs**
   - Look for any errors or warnings

---

## Step 10: Set Up Monitoring (Recommended)

1. **Vercel Analytics:**
   - Enable in **Settings** → **Analytics**
   - Provides performance metrics

2. **Error Tracking:**
   - Consider adding Sentry or similar
   - Configure error boundaries

3. **Database Monitoring:**
   - Use Neon's dashboard to monitor queries
   - Set up alerts for connection issues

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Prisma Client not generated"**
- Add `prisma generate` to postinstall script
- Or run `npx prisma generate` in build command

**Error: "Environment variable not set"**
- Double-check all required env vars are set in Vercel
- Ensure they're set for "Production" environment

### Runtime Errors

**"No tenant context"**
- Check middleware is correctly extracting subdomain
- Verify `NEXTAUTH_URL` matches your domain

**"Database connection failed"**
- Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure connection pooling is enabled (Neon uses pooler by default)

**"S3 upload failed"**
- Verify AWS credentials are correct
- Check IAM user has S3 permissions
- Verify bucket name matches `AWS_S3_BUCKET_NAME`

**"Authentication failed"**
- Verify `AUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain exactly
- Ensure database has users with correct tenantId

---

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `DATABASE_URL` - Neon PostgreSQL connection string
- [ ] `AUTH_SECRET` - Generated with `openssl rand -base64 32` (required for NextAuth v5)
- [ ] `AWS_REGION` - AWS region (e.g., `us-east-1`)
- [ ] `AWS_ACCESS_KEY_ID` - AWS IAM access key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS IAM secret key
- [ ] `AWS_S3_BUCKET_NAME` - S3 bucket name
- [ ] `AWS_SES_REGION` - (Optional) SES region
- [ ] `AWS_SES_ACCESS_KEY_ID` - (Optional) SES access key
- [ ] `AWS_SES_SECRET_ACCESS_KEY` - (Optional) SES secret key
- [ ] `AWS_SES_FROM_EMAIL` - (Optional) Verified SES email

---

## Post-Deployment Checklist

After deployment:

- [ ] Database migrations applied successfully
- [ ] Can access application at production URL
- [ ] Signup flow works
- [ ] Login flow works
- [ ] File uploads work (S3)
- [ ] PDF generation works
- [ ] Multi-tenancy works (subdomain or query param)
- [ ] All CRUD operations work
- [ ] Email notifications work (if configured)
- [ ] Error tracking configured (if using)

---

## Updating Production

When you make changes:

1. **Commit and push to Git:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Vercel automatically deploys:**
   - Vercel watches your Git repository
   - Pushes to `main` trigger production deployments
   - PRs create preview deployments

3. **Run migrations if schema changed:**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

---

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use different secrets** for dev/prod
3. **Rotate AWS keys** periodically
4. **Enable Vercel password protection** for preview deployments
5. **Use HTTPS only** - Vercel provides this automatically
6. **Set up rate limiting** - Consider Vercel Pro for advanced features
7. **Monitor database connections** - Use connection pooling
8. **Review IAM permissions** - Least privilege principle

---

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Neon database logs
3. Review AWS CloudWatch logs (for S3/SES)
4. Check browser console for client errors
5. Review Next.js error logs

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Neon Documentation](https://neon.tech/docs)

