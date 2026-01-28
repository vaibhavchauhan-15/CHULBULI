# 🚀 Vercel Environment Variables Setup Guide

## ❌ Current Error
```
Error: getaddrinfo ENOTFOUND db.piqjlpxozrwfilkpiomg.supabase.co
```

**Cause**: Vercel cannot access environment variables from your local `.env` file. They must be manually configured in Vercel's dashboard.

---

## ✅ Solution: Add Environment Variables to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project**: https://vercel.com/dashboard
2. **Navigate to**: Your Project → Settings → Environment Variables
3. **Add each variable** one by one:

#### Required Environment Variables

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `DATABASE_URL` | `postgresql://postgres:Khushi%4012353@db.piqjlpxozrwfilkpiomg.supabase.co:5432/postgres?sslmode=no-verify` | Production, Preview |
| `JWT_SECRET` | `3d9377a0aa5d56faa790f36f85e08198d28ca847935d319bc6d56dc1377a7681` | Production, Preview |
| `CLOUDINARY_CLOUD_NAME` | `djivsefao` | Production, Preview |
| `CLOUDINARY_API_KEY` | `866364639467747` | Production, Preview |
| `CLOUDINARY_API_SECRET` | `z_SAYTLvTHtLpJSj9Zy0XdR05YY` | Production, Preview |
| `ADMIN_EMAIL` | `admin@chulbulijewels.com` | Production, Preview |
| `ADMIN_PASSWORD` | `Admin@123` | Production, Preview |
| `NODE_ENV` | `production` | Production only |

4. **Click "Save"** after adding each variable
5. **Redeploy** your project: Deployments → Click ⋯ on latest deployment → Redeploy

---

### Method 2: Via Vercel CLI (Faster)

If you have Vercel CLI installed, you can add all variables at once:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add DATABASE_URL production
# Paste: postgresql://postgres:Khushi%4012353@db.piqjlpxozrwfilkpiomg.supabase.co:5432/postgres?sslmode=no-verify

vercel env add JWT_SECRET production
# Paste: 3d9377a0aa5d56faa790f36f85e08198d28ca847935d319bc6d56dc1377a7681

vercel env add CLOUDINARY_CLOUD_NAME production
# Paste: djivsefao

vercel env add CLOUDINARY_API_KEY production
# Paste: 866364639467747

vercel env add CLOUDINARY_API_SECRET production
# Paste: z_SAYTLvTHtLpJSj9Zy0XdR05YY

vercel env add ADMIN_EMAIL production
# Paste: admin@chulbulijewels.com

vercel env add ADMIN_PASSWORD production
# Paste: Admin@123

# Redeploy
vercel --prod
```

---

### Method 3: Using .env.production File (Local Reference Only)

I've created a `.env.production` file in your project for **reference only**. This file:
- ✅ Contains all the required environment variables
- ✅ Is automatically gitignored (won't be committed)
- ❌ Is NOT automatically used by Vercel
- 📝 Use it as a reference when manually entering variables in Vercel dashboard

---

## 🔍 Verify Setup

After adding environment variables and redeploying:

1. **Check Vercel Logs**: https://vercel.com/your-project/logs
2. **Test the signup endpoint**:
   ```bash
   curl -X POST https://chulbuli-store.vercel.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"Test@12345"}'
   ```
3. **Expected response**: 
   ```json
   {"success":true,"user":{...}}
   ```

---

## 🛡️ Security Notes

⚠️ **Never commit `.env` or `.env.production` to Git** - they contain sensitive credentials!

The `.gitignore` file has been updated to ensure these files are never committed.

---

## 📝 Quick Checklist

- [ ] Add all 8 environment variables to Vercel
- [ ] Select "Production" and "Preview" environments for each
- [ ] Click "Save" after each variable
- [ ] Redeploy the project
- [ ] Check logs to confirm no errors
- [ ] Test signup endpoint
- [ ] Delete `.env.production` file after setup (optional, it's gitignored anyway)

---

## 🆘 Troubleshooting

**If you still see database errors:**

1. Verify DATABASE_URL is exactly correct (no extra spaces/characters)
2. Check Supabase dashboard that database is running
3. Verify the password: `Khushi@12353` (URL encoded as `Khushi%4012353`)
4. Ensure all environment variables are selected for "Production" environment
5. Try a full redeploy (not just rerun)

**Still having issues?**
- Check Vercel function logs for detailed error messages
- Verify database is accessible from external connections in Supabase settings
