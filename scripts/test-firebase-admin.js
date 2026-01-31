/**
 * Firebase Admin SDK Test Script
 * Run this to test if Firebase Admin is properly configured
 * 
 * Usage: node scripts/test-firebase-admin.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const match = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

loadEnv();

async function testFirebaseAdmin() {
  console.log('🔥 Testing Firebase Admin SDK Configuration\n');
  console.log('='.repeat(60));

  // Step 1: Check environment variable exists
  console.log('\n📋 Step 1: Checking FIREBASE_SERVICE_ACCOUNT_KEY...');
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    console.log('❌ FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('✅ FIREBASE_SERVICE_ACCOUNT_KEY found');
  console.log(`   Length: ${serviceAccountKey.length} characters`);

  // Step 2: Try to decode base64
  console.log('\n📋 Step 2: Decoding base64...');
  let serviceAccount;
  try {
    const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decoded);
    console.log('✅ Base64 decoded successfully');
  } catch (error) {
    console.log('❌ Failed to decode:', error.message);
    process.exit(1);
  }

  // Step 3: Validate structure
  console.log('\n📋 Step 3: Validating service account structure...');
  const requiredFields = ['type', 'project_id', 'private_key', 'client_email', 'client_id'];
  let valid = true;

  requiredFields.forEach(field => {
    if (serviceAccount[field]) {
      console.log(`✅ ${field}: Present`);
    } else {
      console.log(`❌ ${field}: Missing`);
      valid = false;
    }
  });

  if (!valid) {
    console.log('\n❌ Service account structure is invalid');
    process.exit(1);
  }

  // Step 4: Display service account info
  console.log('\n📋 Step 4: Service Account Information:');
  console.log(`   Type: ${serviceAccount.type}`);
  console.log(`   Project ID: ${serviceAccount.project_id}`);
  console.log(`   Client Email: ${serviceAccount.client_email}`);
  console.log(`   Client ID: ${serviceAccount.client_id}`);

  // Step 5: Try to initialize Firebase Admin
  console.log('\n📋 Step 5: Testing Firebase Admin initialization...');
  try {
    const admin = require('firebase-admin');
    
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('ℹ️  Firebase Admin already initialized, deleting existing apps...');
      await Promise.all(admin.apps.map(app => app.delete()));
    }
    
    // Initialize
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    
    console.log('✅ Firebase Admin SDK initialized successfully!');
    console.log(`   App Name: ${app.name}`);
    
    // Test getting auth instance
    console.log('\n📋 Step 6: Testing Auth instance...');
    const auth = app.auth();
    console.log('✅ Auth instance created successfully');
    
    // Cleanup
    await app.delete();
    console.log('✅ Cleanup completed');
    
  } catch (error) {
    console.log('❌ Firebase Admin initialization failed:');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    process.exit(1);
  }

  // Success
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ ALL TESTS PASSED!');
  console.log('\nFirebase Admin SDK is properly configured.');
  console.log('You can now start the dev server and test Google OAuth.');
  console.log('\nRun: npm run dev\n');
}

// Run the test
testFirebaseAdmin().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
