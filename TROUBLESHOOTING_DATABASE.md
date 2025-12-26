# Troubleshooting: Database Connection Error on Vercel

## Error: "Can't reach database server at base"

This error means Vercel can't connect to your Neon database. Here's how to fix it:

---

## Step 1: Verify DATABASE_URL is Set in Vercel

1. **Go to Vercel Dashboard:**
   - Your Project → **Settings** → **Environment Variables**
   - Look for `DATABASE_URL`
   - Make sure it's set for **Production** environment

2. **If it's missing:**
   - Click "Add New"
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string
   - Environment: Select **Production** (and Preview/Development if needed)
   - Click "Save"

---

## Step 2: Use the Correct Neon Connection String

**Important:** For Vercel (serverless), you MUST use Neon's **connection pooler** URL, not the direct connection URL.

### How to Get the Pooler Connection String:

1. **Go to Neon Dashboard:**
   - https://console.neon.tech
   - Select your project
   - Go to **Connection Details**

2. **Select Connection Pooler:**
   - Look for tabs: "Direct connection" and "Connection pooling"
   - Click on **"Connection pooling"** tab
   - Copy the connection string (it will have `-pooler` in the hostname)

3. **Example Pooler URL:**
   ```
   postgresql://user:password@ep-xxx-xxx-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
   
   Notice: `-pooler` in the hostname

4. **Example Direct URL (DON'T USE THIS):**
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
   
   Notice: No `-pooler` - this won't work on Vercel!

---

## Step 3: Verify Connection String Format

Your `DATABASE_URL` should look like this:

```
postgresql://[user]:[password]@[host]-pooler.[region].aws.neon.tech/[database]?sslmode=require
```

**Required parts:**
- ✅ `postgresql://` protocol
- ✅ Username and password
- ✅ Hostname with `-pooler` suffix
- ✅ Database name
- ✅ `?sslmode=require` parameter

**Common mistakes:**
- ❌ Missing `-pooler` in hostname
- ❌ Missing `?sslmode=require`
- ❌ Using `postgres://` instead of `postgresql://`
- ❌ Extra spaces or line breaks
- ❌ Missing password or username

---

## Step 4: Update DATABASE_URL in Vercel

1. **Copy your pooler connection string** from Neon
2. **Go to Vercel:**
   - Project → Settings → Environment Variables
   - Find `DATABASE_URL`
   - Click "Edit"
   - Paste the pooler connection string
   - Make sure it's exactly correct (no extra spaces)
   - Click "Save"

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger redeploy

---

## Step 5: Verify Database Migrations Ran

After fixing the connection string, make sure your database schema is set up:

```bash
# Link Vercel project locally
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

---

## Step 6: Test the Connection

After redeploying, test your app:
1. Try to sign up a new user
2. Check Vercel logs for any errors
3. If still failing, see "Additional Troubleshooting" below

---

## Additional Troubleshooting

### Check Vercel Logs

1. **Go to Vercel Dashboard:**
   - Your Project → **Deployments**
   - Click on the latest deployment
   - Click **"Logs"** tab
   - Look for database connection errors

### Verify Neon Database is Running

1. **Go to Neon Dashboard:**
   - Check if your database is active
   - Look for any warnings or errors
   - Verify the database hasn't been paused (free tier pauses after inactivity)

### Test Connection String Locally

1. **Add to `.env.local`:**
   ```env
   DATABASE_URL="your-pooler-connection-string"
   ```

2. **Test connection:**
   ```bash
   npx prisma db pull
   ```
   
   If this works locally but not on Vercel, the issue is with how Vercel is reading the env var.

### Check for Special Characters

If your password has special characters, they might need URL encoding:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`
- etc.

**Better solution:** Change your Neon database password to one without special characters, or use Neon's password reset feature.

### Verify Environment Variable Scope

In Vercel, make sure `DATABASE_URL` is set for:
- ✅ **Production** (required)
- ✅ **Preview** (if you want preview deployments to work)
- ✅ **Development** (if using Vercel CLI locally)

---

## Quick Checklist

- [ ] `DATABASE_URL` is set in Vercel Environment Variables
- [ ] Using **pooler** connection string (has `-pooler` in hostname)
- [ ] Connection string includes `?sslmode=require`
- [ ] No extra spaces or line breaks in connection string
- [ ] Database migrations have been run (`prisma migrate deploy`)
- [ ] Neon database is active (not paused)
- [ ] Redeployed after updating environment variable

---

## Still Not Working?

If you've tried everything above:

1. **Double-check the connection string:**
   - Copy directly from Neon dashboard
   - Don't modify it manually
   - Make sure you're copying from "Connection pooling" tab, not "Direct connection"

2. **Create a new Neon database:**
   - Sometimes starting fresh helps
   - Get new connection string
   - Run migrations again

3. **Check Neon Status:**
   - Visit https://status.neon.tech
   - Make sure there are no outages

4. **Contact Support:**
   - Neon support: https://neon.tech/docs/support
   - Vercel support: https://vercel.com/support

---

## Example: Correct vs Incorrect

### ✅ CORRECT (Pooler - Use This):
```
postgresql://neondb_owner:password123@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### ❌ INCORRECT (Direct - Don't Use on Vercel):
```
postgresql://neondb_owner:password123@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

The difference is `-pooler` in the hostname!



