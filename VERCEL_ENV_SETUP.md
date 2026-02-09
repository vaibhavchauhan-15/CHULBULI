# PhonePe Environment Variables - Vercel Setup Guide

## Automated Setup (Recommended)

### Option 1: PowerShell Script (Windows)
```powershell
.\setup-phonepe-vercel-env.ps1
```

### Option 2: Bash Script (Mac/Linux/Git Bash)
```bash
chmod +x setup-phonepe-vercel-env.sh
./setup-phonepe-vercel-env.sh
```

---

## Manual Setup (Copy-Paste Commands)

If the automated scripts don't work, copy and paste these commands one by one:

```bash
# 1. PhonePe Client ID (Production)
echo "SU2602091456313521993499" | vercel env add PHONEPE_CLIENT_ID production

# 2. PhonePe Client Secret (Production)
echo "f20ab239-f1d5-4b42-b57e-4388163cdb3c" | vercel env add PHONEPE_CLIENT_SECRET production

# 3. PhonePe Client Version
echo "1" | vercel env add PHONEPE_CLIENT_VERSION production

# 4. PhonePe Base URL (Production API)
echo "https://api.phonepe.com/apis/pg" | vercel env add PHONEPE_BASE_URL production

# 5. PhonePe Auth URL (Production)
echo "https://api.phonepe.com/apis/identity-manager" | vercel env add PHONEPE_AUTH_URL production

# 6. Application URL (Your Production Domain)
echo "https://www.chulbulijewels.in" | vercel env add NEXT_PUBLIC_APP_URL production

# 7. Webhook Username (Optional - for security)
echo "chulbuli_webhook" | vercel env add PHONEPE_WEBHOOK_USERNAME production

# 8. Webhook Password (Optional - for security)
echo "Khushi12353" | vercel env add PHONEPE_WEBHOOK_PASSWORD production
```

---

## Through Vercel Dashboard (Alternative)

If CLI doesn't work, add variables manually through Vercel Dashboard:

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Click "Add New"
3. Add each variable:

| Environment Variable | Value | Environments |
|---------------------|-------|--------------|
| `PHONEPE_CLIENT_ID` | `SU2602091456313521993499` | Production |
| `PHONEPE_CLIENT_SECRET` | `f20ab239-f1d5-4b42-b57e-4388163cdb3c` | Production |
| `PHONEPE_CLIENT_VERSION` | `1` | Production |
| `PHONEPE_BASE_URL` | `https://api.phonepe.com/apis/pg` | Production |
| `PHONEPE_AUTH_URL` | `https://api.phonepe.com/apis/identity-manager` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://www.chulbulijewels.in` | Production |
| `PHONEPE_WEBHOOK_USERNAME` | `chulbuli_webhook` | Production |
| `PHONEPE_WEBHOOK_PASSWORD` | `Khushi12353` | Production |

---

## Verify Environment Variables

After adding, verify they're set correctly:

```bash
# List all environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.production
```

---

## Redeploy to Production

After adding environment variables, trigger a new deployment:

```bash
# Method 1: Redeploy with latest code
vercel --prod

# Method 2: Redeploy without code changes
vercel redeploy --prod
```

Or push to your main branch to trigger automatic deployment.

---

## Important Notes

- ✅ **NEXT_PUBLIC_APP_URL** must be exact production domain (no trailing slash)
- ✅ All other variables are **server-side only** (not accessible in browser)
- ✅ **PHONEPE_CLIENT_SECRET** is sensitive - never commit to git
- ✅ Webhook credentials are optional but recommended for security
- ✅ After deployment, test payment flow on production

---

## Troubleshooting

### "vercel: command not found"
Install Vercel CLI:
```bash
npm install -g vercel
vercel login
```

### "Not linked to a project"
Link to your Vercel project:
```bash
vercel link
```

### Variables not taking effect
1. Clear build cache: `vercel --prod --force`
2. Wait 1-2 minutes for env vars to propagate
3. Check deployment logs for errors

---

## Next Steps After Setup

1. ✅ Verify all 8 environment variables are added
2. ✅ Redeploy to production
3. ✅ Test checkout page at https://www.chulbulijewels.in/checkout
4. ✅ Verify browser console shows: "Loading PhonePe script for PRODUCTION environment"
5. ✅ Test complete payment flow with real transaction
6. ✅ Monitor webhook endpoint for payment confirmations

---

## Support

Need help? Check:
- [PHONEPE_PRODUCTION_READY.md](./PHONEPE_PRODUCTION_READY.md) - Complete setup guide
- [PHONEPE_PRODUCTION_FIX_SUMMARY.md](./PHONEPE_PRODUCTION_FIX_SUMMARY.md) - Quick reference
- Vercel Docs: https://vercel.com/docs/concepts/projects/environment-variables
