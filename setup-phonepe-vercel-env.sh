#!/bin/bash
# Bash Script to Add PhonePe Environment Variables to Vercel
# Run this script: bash setup-phonepe-vercel-env.sh

echo "================================================"
echo "PhonePe Environment Variables Setup for Vercel"
echo "================================================"
echo ""

# Define all PhonePe environment variables
declare -A envVars=(
    ["PHONEPE_CLIENT_ID"]="SU2602091456313521993499"
    ["PHONEPE_CLIENT_SECRET"]="f20ab239-f1d5-4b42-b57e-4388163cdb3c"
    ["PHONEPE_CLIENT_VERSION"]="1"
    ["PHONEPE_BASE_URL"]="https://api.phonepe.com/apis/pg"
    ["PHONEPE_AUTH_URL"]="https://api.phonepe.com/apis/identity-manager"
    ["NEXT_PUBLIC_APP_URL"]="https://www.chulbulijewels.in"
    ["PHONEPE_WEBHOOK_USERNAME"]="chulbuli_webhook"
    ["PHONEPE_WEBHOOK_PASSWORD"]="Khushi12353"
)

echo "This script will add the following environment variables to Vercel Production:"
echo ""
for key in "${!envVars[@]}"; do
    if [[ "$key" == *"SECRET"* ]] || [[ "$key" == *"PASSWORD"* ]]; then
        echo "  $key = ********"
    else
        echo "  $key = ${envVars[$key]}"
    fi
done | sort
echo ""

read -p "Do you want to continue? (y/n): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Operation cancelled."
    exit 0
fi

echo ""
echo "Adding environment variables to Vercel Production..."
echo ""

successCount=0
errorCount=0

# Sort keys for ordered processing
for key in $(echo "${!envVars[@]}" | tr ' ' '\n' | sort); do
    value="${envVars[$key]}"
    
    echo -n "Adding $key... "
    
    # Use echo to pipe the value into vercel env add
    if echo "$value" | vercel env add "$key" production --force > /dev/null 2>&1; then
        echo "✓ Success"
        ((successCount++))
    else
        echo "✗ Failed"
        ((errorCount++))
    fi
    
    sleep 0.5
done

echo ""
echo "================================================"
echo "Summary:"
echo "  Successfully added: $successCount variables"
echo "  Failed: $errorCount variables"
echo "================================================"
echo ""

if [ $successCount -gt 0 ]; then
    echo "✓ PhonePe environment variables have been added to Vercel!"
    echo ""
    echo "Next steps:"
    echo "  1. Verify variables: vercel env ls"
    echo "  2. Redeploy your app: vercel --prod"
    echo "  3. Test PhonePe payment on production"
else
    echo "✗ Failed to add environment variables."
    echo "Please add them manually using: vercel env add <KEY> production"
fi

echo ""
