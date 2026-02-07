# 🚀 Netlify Deployment Checklist

Use this checklist to ensure your Chulbuli Jewels website is ready for production deployment on Netlify.

## Pre-Deployment Setup

### 1. Code Repository
- [ ] All code is committed to Git
- [ ] Repository is pushed to GitHub, GitLab, or Bitbucket
- [ ] `.gitignore` excludes sensitive files (.env, .netlify, node_modules)
- [ ] No sensitive data (passwords, API keys) in code

### 2. Environment Variables Ready
- [ ] `DATABASE_URL` - Production PostgreSQL connection string
- [ ] `JWT_SECRET` - NEW secure secret (different from dev, 32+ chars)
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary account
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase web API key
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase sender ID
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` - Base64 encoded service account
- [ ] `RAZORPAY_KEY_ID` - Razorpay key ID (production)
- [ ] `RAZORPAY_KEY_SECRET` - Razorpay key secret (production)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay key ID (public)
- [ ] `NODE_ENV=production`

### 3. Database Setup
- [ ] Production database created (Supabase/Neon/Railway)
- [ ] Database allows connections from external IPs
- [ ] Schema migrated: `npm run db:generate && npx drizzle-kit push`
- [ ] Database seeded (optional): `npm run db:seed`
- [ ] Connection pooling enabled (recommended)
- [ ] Database backup configured

### 4. Firebase Configuration
- [ ] Firebase project created
- [ ] Google Authentication enabled
- [ ] Production domain added to authorized domains
  - Go to: Firebase Console → Authentication → Settings → Authorized domains
  - Add: `your-site-name.netlify.app`
- [ ] Service account key generated and base64 encoded
- [ ] Firebase security rules configured

### 5. Razorpay Configuration
- [ ] Razorpay account in Production mode
- [ ] Production API keys obtained
- [ ] Webhook configured (if using webhooks)
- [ ] Production domain whitelisted in Razorpay dashboard

### 6. Cloudinary Configuration
- [ ] Cloudinary account ready
- [ ] Upload presets configured
- [ ] Storage limits checked
- [ ] API keys verified

### 7. Build Test
- [ ] Local build successful: `npm run build`
- [ ] No build errors or warnings
- [ ] All dependencies installed: `npm install`
- [ ] TypeScript compilation successful
- [ ] No console errors in production build

### 8. Code Quality
- [ ] ESLint passes: `npm run lint`
- [ ] No critical security vulnerabilities: `npm audit`
- [ ] Environment variables validated
- [ ] API routes tested locally

## Netlify Configuration

### 9. Netlify Files Ready
- [ ] `netlify.toml` exists in root
- [ ] `@netlify/plugin-nextjs` in devDependencies
- [ ] `.nvmrc` specifies Node version 20
- [ ] `package.json` has engines field

### 10. Security Headers
- [ ] CSP headers include Netlify domains in `next.config.js`
- [ ] CORS configured for API routes
- [ ] Rate limiting configured

## Deployment Steps

### 11. Connect to Netlify
- [ ] Log in to Netlify account
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect Git provider
- [ ] Select repository
- [ ] Build settings auto-detected from `netlify.toml`

### 12. Environment Variables in Netlify
- [ ] All environment variables added in Netlify Dashboard
- [ ] Variable names match exactly (case-sensitive)
- [ ] No placeholder values remaining
- [ ] `NODE_ENV=production` set

### 13. Initial Deployment
- [ ] Click "Deploy site"
- [ ] Monitor build logs for errors
- [ ] Wait for deployment to complete (2-5 minutes)
- [ ] Check deploy log for success message

## Post-Deployment Verification

### 14. Website Functionality
- [ ] Site loads at Netlify URL
- [ ] Homepage displays correctly
- [ ] Images load properly (Cloudinary)
- [ ] Navigation works
- [ ] Product pages load
- [ ] Search functionality works

### 15. Authentication Tests
- [ ] Email/password signup works
- [ ] Email/password login works
- [ ] Google OAuth sign-in works
- [ ] JWT tokens are set correctly
- [ ] Protected routes require authentication
- [ ] Logout works

### 16. E-commerce Features
- [ ] Product catalog loads
- [ ] Product filtering works
- [ ] Add to cart functions
- [ ] Cart persists
- [ ] Checkout process works
- [ ] Order creation successful
- [ ] Order emails sent (if configured)

### 17. Admin Panel
- [ ] Admin login works
- [ ] Dashboard displays analytics
- [ ] Product management functions
- [ ] Order management works
- [ ] Review moderation functional

### 18. API Routes
- [ ] All API endpoints respond correctly
- [ ] Database queries execute
- [ ] Error handling works
- [ ] Rate limiting active
- [ ] CORS headers correct

### 19. Performance
- [ ] Page load time acceptable
- [ ] Images optimized
- [ ] Lighthouse score > 80
- [ ] Core Web Vitals pass

### 20. Mobile Responsiveness
- [ ] Test on mobile devices
- [ ] Touch interactions work
- [ ] Forms usable on mobile
- [ ] Images adapt to screen size

## Optional Enhancements

### 21. Custom Domain (Optional)
- [ ] Domain purchased
- [ ] DNS configured
- [ ] Domain added in Netlify
- [ ] SSL certificate provisioned
- [ ] WWW redirect configured

### 22. Monitoring & Analytics
- [ ] Error tracking configured (optional)
- [ ] Analytics set up (optional)
- [ ] Uptime monitoring (optional)

### 23. CI/CD Configuration
- [ ] Deploy previews enabled for PRs
- [ ] Branch deploys configured
- [ ] Auto-publish on main branch
- [ ] Build notifications set up (optional)

## Troubleshooting

If deployment fails:
1. Check Netlify build logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure database is accessible from Netlify
4. Check Firebase and Razorpay configurations
5. Test build locally: `npm run build`
6. Review [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for detailed troubleshooting

## Success! 🎉

Once all items are checked:
- Your Chulbuli Jewels store is live on Netlify!
- Share your site URL: `https://your-site-name.netlify.app`
- Monitor performance and errors regularly
- Keep dependencies updated
- Backup database regularly

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support/
- Next.js Docs: https://nextjs.org/docs/deployment

**Project Documentation:**
- Full deployment guide: [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)
- Main README: [README.md](README.md)
