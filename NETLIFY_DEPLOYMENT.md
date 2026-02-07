# Netlify Deployment Guide for Chulbuli Jewels

This guide explains how to deploy your Next.js e-commerce application to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://netlify.com))
2. Your repository pushed to GitHub, GitLab, or Bitbucket
3. All environment variables ready (see `.env.example`)

## Deployment Steps

### 1. Connect Your Repository

1. Log in to Netlify
2. Click "Add new site" > "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your `CHULBULI` repository
5. Authorize Netlify to access the repository

### 2. Configure Build Settings

The `netlify.toml` file automatically configures:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20
- **Next.js plugin**: Enabled

Netlify will auto-detect these settings from the `netlify.toml` file.

### 3. Set Environment Variables

In Netlify Dashboard > Site settings > Environment variables, add:

#### Database
- `DATABASE_URL` - Your PostgreSQL connection string

#### Authentication & Security
- `JWT_SECRET` - 256-bit secure secret (generate new for production)

#### Cloudinary (Image Storage)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

#### Firebase (Google OAuth)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY`

#### Razorpay (Payments)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

#### Node Environment
- `NODE_ENV` - Set to `production`

### 4. Deploy

1. Click "Deploy site" in Netlify
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, your site will be live at `https://[random-name].netlify.app`

### 5. Configure Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

### 6. Enable HTTPS

Netlify automatically provisions SSL certificates via Let's Encrypt. This happens automatically within minutes of deployment.

## Important Configuration Notes

### Database Migrations

Before deploying, ensure your database is set up:

```bash
npm run db:generate
npm run db:migrate
```

### Firebase Configuration

Update your Firebase project's authorized domains:
1. Go to Firebase Console > Authentication > Settings
2. Add your Netlify domain to "Authorized domains"
3. Format: `your-site-name.netlify.app`

### Razorpay Configuration

Update your Razorpay dashboard:
1. Go to Settings > Website & App Name
2. Add your Netlify domain to authorized domains
3. Update webhook URLs if you're using webhooks

### Environment-Specific Variables

The `netlify.toml` automatically sets `NODE_ENV=production` for all deployments.

## Continuous Deployment

Netlify automatically deploys when you push to your repository:
- **Production**: Deploys from your main/master branch
- **Preview**: Creates deploy previews for pull requests
- **Branch deploys**: Can deploy from specific branches

## Monitoring and Logs

1. **Build logs**: Site overview > Production deploys > [latest deploy]
2. **Function logs**: Functions tab (for API routes)
3. **Analytics**: Enable Netlify Analytics in Site settings

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node version compatibility (using Node 20)

### API Routes Not Working

1. Ensure Next.js plugin is enabled in `netlify.toml`
2. Check function logs for errors
3. Verify environment variables are set correctly

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check if your database allows connections from Netlify's IP ranges
3. For Supabase, ensure connection pooling is enabled

### Image Loading Issues

1. Verify Cloudinary credentials
2. Check Content Security Policy headers in `next.config.js`
3. Ensure image domains are whitelisted

### Authentication Issues

1. Verify Firebase credentials and authorized domains
2. Check JWT_SECRET is set correctly
3. Ensure cookies are working (check domain settings)

## Performance Optimization

1. **Enable caching**: Already configured in `netlify.toml`
2. **Image optimization**: Next.js Image component handles this
3. **CDN**: Netlify's global CDN is automatic
4. **Compression**: Automatic gzip/brotli compression

## Security Checklist

- [ ] All environment variables are set (no placeholders)
- [ ] JWT_SECRET is different from development
- [ ] Firebase authorized domains updated
- [ ] Razorpay authorized domains updated
- [ ] Database security rules configured
- [ ] HTTPS is enabled (automatic)
- [ ] Security headers configured (in `next.config.js`)

## Cost Considerations

Netlify Free Tier includes:
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

For production e-commerce, consider:
- **Pro Plan** ($19/month): More bandwidth, build minutes, and features
- **Business Plan** ($99/month): Advanced features, higher limits

## Support

- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support/
- Next.js on Netlify: https://docs.netlify.com/integrations/frameworks/next-js/

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Netlify Next.js Plugin](https://github.com/netlify/netlify-plugin-nextjs)
- [Environment Variables Best Practices](https://docs.netlify.com/environment-variables/overview/)
