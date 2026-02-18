# 🚀 Quick Start - Production Deployment

**For detailed instructions, see: [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)**

---

## ⚡ Quick Deploy to Vercel

### 1. Configure Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these for **Production** environment:

```env
# PhonePe Production
PHONEPE_CLIENT_ID=your_production_client_id
PHONEPE_CLIENT_SECRET=your_production_client_secret
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager
PHONEPE_WEBHOOK_USERNAME=your_webhook_username
PHONEPE_WEBHOOK_PASSWORD=your_webhook_password

# Application
APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
DATABASE_URL=postgresql://...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
FIREBASE_SERVICE_ACCOUNT_KEY=base64_encoded_json

# Security
JWT_SECRET=your_32char_secret
CSRF_SECRET=your_csrf_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 2. Deploy

```bash
git add .
git commit -m "Production deployment"
git push origin main
```

### 3. Configure PhonePe Webhook

1. Log in to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Go to: **Developers → Webhooks**
3. Set URL: `https://your-domain.vercel.app/api/payment/phonepe/webhook`
4. Set authentication credentials
5. Add credentials to Vercel environment variables
6. Redeploy

### 4. Test Production

```bash
# Test health
curl https://your-domain.vercel.app/api/health

# Create test payment (₹1-10)
# Complete on PhonePe
# Refund via PhonePe Dashboard
```

---

## ✅ Pre-Deployment Checklist

Run these commands before deploying:

```bash
# Validate environment
npm run env:validate

# Check production readiness
node scripts/production-readiness-check.js

# Build for production
npm run build

# Test locally
npm start
```

---

## 📚 Full Documentation

- **[PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)** - What was implemented
- **[environment-setup.md](environment-setup.md)** - Environment configuration

---

## 🆘 Quick Troubleshooting

### "KEY_NOT_CONFIGURED" Error
→ Contact PhonePe to activate Standard Checkout API

### Webhook Not Received
→ Check webhook URL and credentials in PhonePe Dashboard

### Build Fails
→ Run `npm run build` locally to see errors

### Environment Errors
→ Run `npm run env:validate` to check configuration

---

## 📞 Support

- **PhonePe:** [business.phonepe.com/support](https://business.phonepe.com/support)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)

---

**Status:** ✅ Ready for Production!
