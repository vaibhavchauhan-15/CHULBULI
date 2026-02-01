# Fix Vercel Environment Variables - Remove trailing newlines
Write-Host "Fixing Firebase Environment Variables in Vercel..." -ForegroundColor Cyan

# Firebase Client Variables (without newlines)
$env:NEXT_PUBLIC_FIREBASE_API_KEY = "AIzaSyCcdum-kszxqBtKXZfpvF5BDUaVoX3R9rg"
$env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "chulbuli-jewels-store.firebaseapp.com"
$env:NEXT_PUBLIC_FIREBASE_PROJECT_ID = "chulbuli-jewels-store"
$env:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "chulbuli-jewels-store.firebasestorage.app"
$env:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "553889037702"
$env:NEXT_PUBLIC_FIREBASE_APP_ID = "1:553889037702:web:fc6fc223a7d6ddf1e18007"
$env:NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = "G-H3HS9VR885"

Write-Host "`nRun these commands in Vercel Dashboard or use Vercel CLI:" -ForegroundColor Yellow
Write-Host "`n1. Go to https://vercel.com/vaibhav-chauhans-projects-aa3b09a3/chulbuli-store/settings/environment-variables" -ForegroundColor Green
Write-Host "2. For each Firebase variable, click the '...' menu and 'Edit'" -ForegroundColor Green
Write-Host "3. Copy-paste the EXACT values below (no extra spaces/newlines):" -ForegroundColor Green

Write-Host "`nNEXT_PUBLIC_FIREBASE_API_KEY:" -ForegroundColor Cyan
Write-Host $env:NEXT_PUBLIC_FIREBASE_API_KEY

Write-Host "`nNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:" -ForegroundColor Cyan
Write-Host $env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

Write-Host "`nNEXT_PUBLIC_FIREBASE_PROJECT_ID:" -ForegroundColor Cyan
Write-Host $env:NEXT_PUBLIC_FIREBASE_PROJECT_ID

Write-Host "`nNEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:" -ForegroundColor Cyan
Write-Host $env:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

Write-Host "`nNEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:" -ForegroundColor Cyan
Write-Host $env:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

Write-Host "`nNEXT_PUBLIC_FIREBASE_APP_ID:" -ForegroundColor Cyan
Write-Host $env:NEXT_PUBLIC_FIREBASE_APP_ID

Write-Host "`nNEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:" -ForegroundColor Cyan
Write-Host $env:NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

Write-Host "`n`n4. Make sure to select 'Production', 'Preview', and 'Development' for each variable" -ForegroundColor Green
Write-Host "5. After editing all variables, redeploy: vercel --prod" -ForegroundColor Green
