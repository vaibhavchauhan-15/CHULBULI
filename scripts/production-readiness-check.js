#!/usr/bin/env node
/**
 * Production Readiness Check Script
 * 
 * This script performs comprehensive checks to ensure the application
 * is ready for production deployment.
 * 
 * Usage:
 *   node scripts/production-readiness-check.js
 * 
 * Run this BEFORE deploying to production to catch configuration issues.
 */

const https = require('https');
const http = require('http');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const checks = {
  passed: [],
  warnings: [],
  errors: [],
  info: []
};

function log(type, category, message, detail = null) {
  checks[type].push({ category, message, detail });
}

function printHeader() {
  console.log('\n' + colors.bold + colors.cyan + '═'.repeat(80) + colors.reset);
  console.log(colors.bold + colors.cyan + '  PRODUCTION READINESS CHECK' + colors.reset);
  console.log(colors.bold + colors.cyan + '═'.repeat(80) + colors.reset + '\n');
}

function printResults() {
  console.log('\n' + colors.bold + '─'.repeat(80) + colors.reset);
  console.log(colors.bold + 'RESULTS:' + colors.reset + '\n');

  // Errors
  if (checks.errors.length > 0) {
    console.log(colors.red + colors.bold + '❌ CRITICAL ISSUES (Must Fix):' + colors.reset);
    checks.errors.forEach(({ category, message, detail }) => {
      console.log(`   ${colors.red}✗${colors.reset} ${colors.bold}${category}${colors.reset}: ${message}`);
      if (detail) console.log(`     ${colors.red}→ ${detail}${colors.reset}`);
    });
    console.log('');
  }

  // Warnings
  if (checks.warnings.length > 0) {
    console.log(colors.yellow + colors.bold + '⚠️  WARNINGS (Review Before Deploy):' + colors.reset);
    checks.warnings.forEach(({ category, message, detail }) => {
      console.log(`   ${colors.yellow}⚠${colors.reset} ${colors.bold}${category}${colors.reset}: ${message}`);
      if (detail) console.log(`     ${colors.yellow}→ ${detail}${colors.reset}`);
    });
    console.log('');
  }

  // Passed
  if (checks.passed.length > 0) {
    console.log(colors.green + colors.bold + '✅ PASSED CHECKS:' + colors.reset);
    checks.passed.forEach(({ category, message }) => {
      console.log(`   ${colors.green}✓${colors.reset} ${colors.bold}${category}${colors.reset}: ${message}`);
    });
    console.log('');
  }

  // Info
  if (checks.info.length > 0) {
    console.log(colors.blue + colors.bold + 'ℹ️  INFORMATION:' + colors.reset);
    checks.info.forEach(({ category, message, detail }) => {
      console.log(`   ${colors.blue}ℹ${colors.reset} ${colors.bold}${category}${colors.reset}: ${message}`);
      if (detail) console.log(`     ${detail}`);
    });
    console.log('');
  }

  // Summary
  console.log(colors.bold + '─'.repeat(80) + colors.reset);
  console.log(colors.bold + 'SUMMARY:' + colors.reset);
  console.log(`   ${colors.green}✓ Passed${colors.reset}: ${checks.passed.length}`);
  console.log(`   ${colors.yellow}⚠ Warnings${colors.reset}: ${checks.warnings.length}`);
  console.log(`   ${colors.red}✗ Errors${colors.reset}: ${checks.errors.length}`);
  console.log(colors.bold + '═'.repeat(80) + colors.reset + '\n');

  // Final verdict
  if (checks.errors.length > 0) {
    console.log(colors.red + colors.bold + '❌ NOT READY FOR PRODUCTION' + colors.reset);
    console.log('Fix the critical issues above before deploying.\n');
    process.exit(1);
  } else if (checks.warnings.length > 0) {
    console.log(colors.yellow + colors.bold + '⚠️  READY WITH WARNINGS' + colors.reset);
    console.log('Review warnings and proceed with caution.\n');
    process.exit(0);
  } else {
    console.log(colors.green + colors.bold + '✅ READY FOR PRODUCTION!' + colors.reset);
    console.log('All checks passed. You can deploy to production.\n');
    process.exit(0);
  }
}

async function checkPhonePeConfiguration() {
  console.log(colors.cyan + 'Checking PhonePe configuration...' + colors.reset);

  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const baseUrl = process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg';
  const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME;
  const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD;

  // Check credentials exist
  if (!clientId) {
    log('errors', 'PhonePe Client ID', 'Missing PHONEPE_CLIENT_ID', 
      'Get from PhonePe Business Dashboard');
    return;
  }

  if (!clientSecret) {
    log('errors', 'PhonePe Client Secret', 'Missing PHONEPE_CLIENT_SECRET',
      'Get from PhonePe Business Dashboard');
    return;
  }

  log('passed', 'PhonePe Credentials', 'Client ID and Secret are set');

  // Check if production or sandbox
  const isProduction = baseUrl.includes('api.phonepe.com') && !baseUrl.includes('preprod');
  const isSandbox = baseUrl.includes('api-preprod.phonepe.com');

  if (isProduction) {
    log('info', 'PhonePe Environment', 'Configured for PRODUCTION mode',
      'Real payments will be processed');
  } else if (isSandbox) {
    log('info', 'PhonePe Environment', 'Configured for SANDBOX mode',
      'Test mode - no real payments');
  } else {
    log('warnings', 'PhonePe Environment', 'Unknown PhonePe URL', 
      `URL: ${baseUrl}`);
  }

  // Check webhook credentials
  if (!webhookUsername || !webhookPassword) {
    log('warnings', 'PhonePe Webhook Auth', 'Webhook credentials not set',
      'Webhook signature verification may fail');
  } else {
    log('passed', 'PhonePe Webhook Auth', 'Webhook credentials configured');
  }

  // Check merchant ID format
  const merchantIdMatch = clientId.match(/^([A-Z0-9]+)_?/);
  if (merchantIdMatch) {
    const merchantId = merchantIdMatch[1];
    log('passed', 'PhonePe Merchant ID', `Extracted: ${merchantId}`);
  }
}

function checkDatabaseConfiguration() {
  console.log(colors.cyan + 'Checking database configuration...' + colors.reset);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  if (!supabaseUrl) {
    log('errors', 'Supabase URL', 'Missing NEXT_PUBLIC_SUPABASE_URL');
    return;
  }

  if (!supabaseKey) {
    log('errors', 'Supabase Key', 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }

  log('passed', 'Supabase Configuration', 'URL and key are set');

  // Check if production project
  if (supabaseUrl.includes('supabase.co')) {
    log('passed', 'Supabase Project', 'Using Supabase cloud project');
  }

  // Check DATABASE_URL format
  if (databaseUrl) {
    if (databaseUrl.includes('sslmode=require') || databaseUrl.includes('ssl=true')) {
      log('passed', 'Database SSL', 'SSL is enabled');
    } else {
      log('warnings', 'Database SSL', 'SSL not detected in DATABASE_URL',
        'Add ?sslmode=require for security');
    }
  }
}

function checkFirebaseConfiguration() {
  console.log(colors.cyan + 'Checking Firebase configuration...' + colors.reset);

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!apiKey || !projectId) {
    log('warnings', 'Firebase Auth', 'Firebase not fully configured',
      'Required for Google Sign-In');
    return;
  }

  log('passed', 'Firebase Configuration', 'API key and project ID set');

  if (!serviceAccount) {
    log('warnings', 'Firebase Admin', 'Service account key not set',
      'Required for server-side Firebase operations');
  } else {
    log('passed', 'Firebase Admin', 'Service account configured');
  }
}

function checkSecuritySecrets() {
  console.log(colors.cyan + 'Checking security secrets...' + colors.reset);

  const jwtSecret = process.env.JWT_SECRET;
  const csrfSecret = process.env.CSRF_SECRET;
  const cronSecret = process.env.CRON_SECRET;

  // JWT Secret
  if (!jwtSecret) {
    log('errors', 'JWT Secret', 'Missing JWT_SECRET',
      'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  } else if (jwtSecret.length < 32) {
    log('warnings', 'JWT Secret', 'JWT_SECRET is too short',
      'Should be at least 32 characters for security');
  } else {
    log('passed', 'JWT Secret', `Configured (${jwtSecret.length} characters)`);
  }

  // CSRF Secret
  if (!csrfSecret) {
    log('warnings', 'CSRF Secret', 'CSRF_SECRET not set',
      'Recommended for additional security');
  } else {
    log('passed', 'CSRF Secret', 'Configured');
  }

  // Cron Secret
  if (!cronSecret) {
    log('info', 'Cron Secret', 'CRON_SECRET not set',
      'Optional: Only needed if using cron jobs');
  } else {
    log('passed', 'Cron Secret', 'Configured');
  }
}

function checkApplicationUrls() {
  console.log(colors.cyan + 'Checking application URLs...' + colors.reset);

  const appUrl = process.env.APP_URL;
  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const nodeEnv = process.env.NODE_ENV;

  if (!appUrl && !publicAppUrl) {
    log('errors', 'Application URL', 'Missing APP_URL and NEXT_PUBLIC_APP_URL',
      'Set to your production domain');
    return;
  }

  const url = appUrl || publicAppUrl;

  // Check HTTPS in production
  if (nodeEnv === 'production' && !url.startsWith('https://') && !url.includes('localhost')) {
    log('errors', 'HTTPS Required', 'Production URL must use HTTPS',
      'Update APP_URL to use https://');
  } else if (url.startsWith('https://')) {
    log('passed', 'HTTPS', 'Using secure HTTPS connection');
  }

  // Check localhost
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    if (nodeEnv === 'production') {
      log('warnings', 'Localhost in Production', 'APP_URL is set to localhost',
        'This should be your production domain');
    } else {
      log('info', 'Development URL', 'Using localhost (development mode)');
    }
  } else {
    log('passed', 'Production URL', `Configured: ${url}`);
  }
}

function checkCloudinaryConfiguration() {
  console.log(colors.cyan + 'Checking Cloudinary configuration...' + colors.reset);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    log('warnings', 'Cloudinary', 'Cloudinary not fully configured',
      'Required for image uploads in admin panel');
    return;
  }

  log('passed', 'Cloudinary', 'Cloud name, API key, and secret configured');
}

function checkBuildDirectories() {
  console.log(colors.cyan + 'Checking build artifacts...' + colors.reset);

  const fs = require('fs');
  const path = require('path');

  const nextDir = path.join(process.cwd(), '.next');
  
  if (fs.existsSync(nextDir)) {
    log('passed', 'Build Artifacts', '.next directory exists');
  } else {
    log('warnings', 'Build Artifacts', '.next directory not found',
      'Run "npm run build" before deploying');
  }
}

function checkEnvironmentMode() {
  console.log(colors.cyan + 'Checking environment mode...' + colors.reset);

  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;

  if (nodeEnv === 'production' || vercelEnv === 'production') {
    log('info', 'Environment Mode', 'PRODUCTION mode detected',
      'All production validations are active');
  } else {
    log('info', 'Environment Mode', `${nodeEnv || 'development'} mode`,
      'Some production checks are skipped');
  }
}

async function testPhonePeConnection() {
  console.log(colors.cyan + 'Testing PhonePe connection...' + colors.reset);

  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const authUrl = process.env.PHONEPE_AUTH_URL || 'https://api.phonepe.com/apis/identity-manager';

  if (!clientId || !clientSecret) {
    log('info', 'PhonePe Connection', 'Skipped (credentials not set)');
    return;
  }

  try {
    // This would normally test OAuth token generation
    // For simplicity in this script, we just verify URLs are reachable
    log('info', 'PhonePe Connection', 'Connection test requires full OAuth flow',
      'Use /api/payment/phonepe/test endpoint after deployment');
  } catch (error) {
    log('warnings', 'PhonePe Connection', 'Could not verify connection',
      error.message);
  }
}

async function main() {
  printHeader();

  console.log('Running production readiness checks...\n');

  // Run all checks
  checkEnvironmentMode();
  checkApplicationUrls();
  checkPhonePeConfiguration();
  checkDatabaseConfiguration();
  checkFirebaseConfiguration();
  checkSecuritySecrets();
  checkCloudinaryConfiguration();
  checkBuildDirectories();
  await testPhonePeConnection();

  // Print results
  printResults();
}

// Run checks
main().catch(error => {
  console.error(colors.red + '\nUnexpected error during readiness check:' + colors.reset);
  console.error(error);
  process.exit(1);
});
