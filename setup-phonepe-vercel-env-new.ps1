# PowerShell Script to Add PhonePe Environment Variables to Vercel
# Run this script: .\setup-phonepe-vercel-env-new.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PhonePe Environment Variables Setup for Vercel" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Define all PhonePe environment variables
$envVars = @{
    "PHONEPE_CLIENT_ID" = "SU2602091456313521993499"
    "PHONEPE_CLIENT_SECRET" = "f20ab239-f1d5-4b42-b57e-4388163cdb3c"
    "PHONEPE_CLIENT_VERSION" = "1"
    "PHONEPE_BASE_URL" = "https://api.phonepe.com/apis/pg"
    "PHONEPE_AUTH_URL" = "https://api.phonepe.com/apis/identity-manager"
    "NEXT_PUBLIC_APP_URL" = "https://www.chulbulijewels.in"
    "PHONEPE_WEBHOOK_USERNAME" = "chulbuli_webhook"
    "PHONEPE_WEBHOOK_PASSWORD" = "Khushi12353"
}

Write-Host "This script will add the following environment variables to Vercel:" -ForegroundColor Yellow
Write-Host ""
foreach ($key in $envVars.Keys | Sort-Object) {
    if ($key -like "*SECRET*" -or $key -like "*PASSWORD*") {
        Write-Host "  $key = ********" -ForegroundColor Gray
    } else {
        Write-Host "  $key = $($envVars[$key])" -ForegroundColor Gray
    }
}
Write-Host ""

$confirm = Read-Host "Do you want to continue? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Operation cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Adding environment variables to Vercel Production..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($key in $envVars.Keys | Sort-Object) {
    $value = $envVars[$key]
    
    Write-Host "Adding $key..." -ForegroundColor Cyan -NoNewline
    
    # Use echo to pipe the value into vercel env add
    $value | vercel env add $key production --force 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓ Success" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host " ✗ Failed (exit code: $LASTEXITCODE)" -ForegroundColor Red
        $errorCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Successfully added: $successCount variables" -ForegroundColor Green
$errorColor = if ($errorCount -gt 0) { "Red" } else { "Gray" }
Write-Host "  Failed: $errorCount variables" -ForegroundColor $errorColor
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "✓ PhonePe environment variables have been added to Vercel!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Verify variables: vercel env ls" -ForegroundColor Gray
    Write-Host "  2. Redeploy your app: vercel --prod" -ForegroundColor Gray
    Write-Host "  3. Test PhonePe payment on production" -ForegroundColor Gray
} else {
    Write-Host "✗ Failed to add environment variables." -ForegroundColor Red
    Write-Host "Please add them manually using: vercel env add <KEY> production" -ForegroundColor Yellow
}

Write-Host ""
