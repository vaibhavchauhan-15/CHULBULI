# Vercel Deployment Guide for Chulbuli Jewels

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- PostgreSQL database (Supabase, Neon, or any PostgreSQL provider)
- Cloudinary account for image uploads

## Step 1: Prepare Your Database

1. Create a PostgreSQL database (recommended: Supabase or Neon)
2. Copy your database connection string (format: `postgresql://user:password@host:5432/database`)
3. Run migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/database"

# JWT Secret (Generate a secure 64-character hex string)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-64-character-secure-hex-string-here"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Node Environment
NODE_ENV="production"
```

### Generate JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env.local` file
   - Make sure to add them for Production, Preview, and Development environments

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and add your environment variables when asked

## Step 4: Configure Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## Step 5: Post-Deployment

1. **Seed Database** (if needed):
   - You may need to seed your database with initial products and admin user
   - Consider using a migration script or admin panel

2. **Test Your Application**:
   - Test user registration and login
   - Test product browsing
   - Test cart and checkout functionality
   - Test admin panel features

3. **Monitor**:
   - Check Vercel Analytics
   - Monitor database performance
   - Set up error tracking (optional: Sentry, LogRocket)

## Important Security Notes

⚠️ **CRITICAL SECURITY REQUIREMENTS**:

1. **Never commit `.env` or `.env.local` files** to version control
2. **Use different JWT secrets** for development and production
3. **Rotate secrets periodically** for security
4. **Use strong passwords** for database users
5. **Enable SSL/TLS** for database connections in production
6. **Review Vercel security headers** in `next.config.js`

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check the build logs in Vercel dashboard
2. Ensure all environment variables are set correctly
3. Verify database connection string is correct
4. Run `npm run build` locally to test

### Database Connection Issues

- Verify your DATABASE_URL is correct
- Check if your database allows connections from Vercel's IP ranges
- For Supabase: Use the "connection pooling" URL for serverless
- For Neon: Enable connection pooling in settings

### Image Upload Issues

- Verify Cloudinary credentials are correct
- Check Cloudinary upload preset settings
- Ensure image domains are added to `next.config.js`

## Vercel-Specific Configuration

Your project already includes:
- ✅ `next.config.js` with proper security headers
- ✅ Dynamic route configuration for API routes
- ✅ Optimized database connection pooling
- ✅ Suspense boundaries for client-side routing
- ✅ Image optimization configuration

## Performance Optimization

Vercel automatically provides:
- Edge caching
- Image optimization
- Automatic SSL
- CDN distribution
- Serverless function optimization

## Support

For issues:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Check project issues on GitHub

## Deployment Checklist

- [ ] Database created and connection string obtained
- [ ] All environment variables set in Vercel
- [ ] JWT secret generated (64 characters minimum)
- [ ] Cloudinary account configured
- [ ] GitHub repository connected to Vercel
- [ ] Initial deployment successful
- [ ] Database migrations run
- [ ] Test user registration/login
- [ ] Test product features
- [ ] Test admin panel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics configured (optional)

---

**Your Chulbuli Jewels e-commerce site is now ready for production! 🎉**
