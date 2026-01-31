/**
 * Firebase Configuration Validation Script
 * Run this to verify your Firebase setup before testing Google OAuth
 * 
 * Usage: node scripts/validate-firebase-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Configuration Validator\n');
console.log('=' .repeat(60));

// Check for .env.local file
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('\n❌ CRITICAL: .env.local file not found!');
  console.log('   Create a .env.local file in your project root');
  console.log('   See FIREBASE_SETUP_GUIDE.md for instructions\n');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
const envVars = {};

envLines.forEach(line => {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
});

console.log('\n📋 Checking Required Environment Variables:\n');

// Client-side Firebase Config
const clientVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

console.log('Client-side Firebase Configuration:');
let clientConfigComplete = true;

clientVars.forEach(varName => {
  const exists = !!envVars[varName];
  const value = envVars[varName];
  const isPlaceholder = value && (
    value.includes('your-') || 
    value.includes('REPLACE') ||
    value.length < 10
  );
  
  if (!exists) {
    console.log(`  ❌ ${varName} - MISSING`);
    clientConfigComplete = false;
  } else if (isPlaceholder) {
    console.log(`  ⚠️  ${varName} - Placeholder value (needs to be updated)`);
    clientConfigComplete = false;
  } else {
    console.log(`  ✅ ${varName} - Configured`);
  }
});

// Server-side Firebase Admin Config
console.log('\nServer-side Firebase Admin Configuration:');
let serverConfigComplete = true;

const serviceAccountKey = envVars['FIREBASE_SERVICE_ACCOUNT_KEY'];

if (!serviceAccountKey) {
  console.log('  ❌ FIREBASE_SERVICE_ACCOUNT_KEY - MISSING');
  serverConfigComplete = false;
} else if (
  serviceAccountKey.includes('your-') || 
  serviceAccountKey.includes('REPLACE') ||
  serviceAccountKey.length < 100
) {
  console.log('  ⚠️  FIREBASE_SERVICE_ACCOUNT_KEY - Placeholder value (needs to be updated)');
  serverConfigComplete = false;
} else {
  // Try to decode and validate
  try {
    const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decoded);
    
    if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
      console.log('  ✅ FIREBASE_SERVICE_ACCOUNT_KEY - Valid');
      console.log(`     Project ID: ${serviceAccount.project_id}`);
      console.log(`     Client Email: ${serviceAccount.client_email}`);
    } else {
      console.log('  ❌ FIREBASE_SERVICE_ACCOUNT_KEY - Invalid structure');
      serverConfigComplete = false;
    }
  } catch (error) {
    console.log('  ❌ FIREBASE_SERVICE_ACCOUNT_KEY - Invalid base64 or JSON');
    serverConfigComplete = false;
  }
}

// Other required configs
console.log('\nOther Required Configuration:');
const otherVars = ['DATABASE_URL', 'JWT_SECRET'];
let otherConfigComplete = true;

otherVars.forEach(varName => {
  const exists = !!envVars[varName];
  const value = envVars[varName];
  const isPlaceholder = value && (
    value.includes('your-') || 
    value.includes('REPLACE') ||
    value.length < 20
  );
  
  if (!exists) {
    console.log(`  ❌ ${varName} - MISSING`);
    otherConfigComplete = false;
  } else if (isPlaceholder) {
    console.log(`  ⚠️  ${varName} - Placeholder value (needs to be updated)`);
    otherConfigComplete = false;
  } else {
    console.log(`  ✅ ${varName} - Configured`);
  }
});

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Configuration Status:\n');

if (clientConfigComplete && serverConfigComplete && otherConfigComplete) {
  console.log('✅ All configurations are valid!');
  console.log('   You can now start the development server and test Google OAuth\n');
  console.log('   Run: npm run dev\n');
  process.exit(0);
} else {
  console.log('❌ Configuration incomplete or invalid\n');
  
  if (!clientConfigComplete) {
    console.log('   ⚠️  Client-side Firebase config needs attention');
    console.log('      See FIREBASE_SETUP_GUIDE.md - Step 1\n');
  }
  
  if (!serverConfigComplete) {
    console.log('   ⚠️  Server-side Firebase Admin config needs attention');
    console.log('      See FIREBASE_SETUP_GUIDE.md - Step 2 & 3\n');
  }
  
  if (!otherConfigComplete) {
    console.log('   ⚠️  Other configurations need attention');
    console.log('      See .env.example for all required variables\n');
  }
  
  console.log('📚 Next Steps:');
  console.log('   1. Open FIREBASE_SETUP_GUIDE.md');
  console.log('   2. Complete all setup steps');
  console.log('   3. Run this script again to validate');
  console.log('   4. Restart the dev server\n');
  
  process.exit(1);
}
