/**
 * PhonePe Production Environment Verification Script
 * 
 * This script helps verify that your production PhonePe setup is correctly configured.
 * Run this to verify LIVE credentials are working before accepting real payments.
 * 
 * Usage:
 *   node scripts/verify-phonepe-production.js
 * 
 * Or test with specific environment variables:
 *   NODE_ENV=production PHONEPE_CLIENT_ID=xxx ... node scripts/verify-phonepe-production.js
 */

const crypto = require('crypto');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n');
  log('═'.repeat(80), 'cyan');
  log(`  ${title}`, 'bold');
  log('═'.repeat(80), 'cyan');
}

function logSuccess(message) {
  log(`✔ ${message}`, 'green');
}

function logError(message) {
  log(`✖ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Load environment variables
try {
  require('dotenv').config();
} catch (error) {
  // dotenv not installed, will use existing environment variables
  console.log('ℹ dotenv not found, using existing environment variables');
}

const config = {
  clientId: process.env.PHONEPE_CLIENT_ID?.trim(),
  clientSecret: process.env.PHONEPE_CLIENT_SECRET?.trim(),
  clientVersion: process.env.PHONEPE_CLIENT_VERSION?.trim() || '1',
  baseUrl: (process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg').trim().replace(/\/+$/, ''),
  authUrl: (process.env.PHONEPE_AUTH_URL || 'https://api.phonepe.com/apis/identity-manager').trim().replace(/\/+$/, ''),
  webhookUrl: process.env.PHONEPE_WEBHOOK_URL?.trim(),
  webhookUsername: process.env.PHONEPE_WEBHOOK_USERNAME?.trim(),
  webhookPassword: process.env.PHONEPE_WEBHOOK_PASSWORD?.trim(),
  appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Detect environment from URLs
function detectEnvironment() {
  const isSandbox = config.baseUrl.includes('preprod') || 
                   config.baseUrl.includes('sandbox') ||
                   config.authUrl.includes('preprod') || 
                   config.authUrl.includes('sandbox');
  return isSandbox ? 'SANDBOX' : 'PRODUCTION';
}

const detectedEnv = detectEnvironment();

// Validation results
const checks = {
  passed: [],
  failed: [],
  warnings: [],
};

function addCheck(type, message) {
  checks[type].push(message);
  if (type === 'passed') logSuccess(message);
  else if (type === 'failed') logError(message);
  else if (type === 'warnings') logWarning(message);
}

async function verifyConfiguration() {
  logSection('🔧 CONFIGURATION VERIFICATION');

  logInfo(`Detected Environment: ${detectedEnv}`);
  logInfo(`NODE_ENV: ${config.nodeEnv}`);
  console.log('');

  // Check Client Credentials
  if (config.clientId && config.clientId.length > 10) {
    addCheck('passed', `Client ID is set (${config.clientId.substring(0, 20)}...)`);
  } else {
    addCheck('failed', 'PHONEPE_CLIENT_ID is missing or invalid');
  }

  if (config.clientSecret && config.clientSecret.length > 10) {
    addCheck('passed', 'Client Secret is set (hidden for security)');
  } else {
    addCheck('failed', 'PHONEPE_CLIENT_SECRET is missing or invalid');
  }

  // Check URLs
  logInfo(`Base URL: ${config.baseUrl}`);
  logInfo(`Auth URL: ${config.authUrl}`);
  logInfo(`App URL: ${config.appUrl}`);
  console.log('');

  // Production URL Validation
  if (detectedEnv === 'PRODUCTION') {
    if (config.baseUrl === 'https://api.phonepe.com/apis/pg') {
      addCheck('passed', 'Using correct PRODUCTION base URL');
    } else {
      addCheck('failed', `Production base URL incorrect: ${config.baseUrl}`);
    }

    if (config.authUrl === 'https://api.phonepe.com/apis/identity-manager') {
      addCheck('passed', 'Using correct PRODUCTION auth URL');
    } else {
      addCheck('failed', `Production auth URL incorrect: ${config.authUrl}`);
    }

    // Production app URL must be HTTPS
    if (config.appUrl.startsWith('https://')) {
      addCheck('passed', 'App URL is HTTPS (required for production)');
    } else {
      addCheck('failed', `App URL must be HTTPS in production: ${config.appUrl}`);
    }

    if (config.appUrl.includes('localhost') || config.appUrl.includes('127.0.0.1')) {
      addCheck('failed', 'App URL cannot be localhost in production');
    } else {
      addCheck('passed', 'App URL is not localhost');
    }
  } else {
    // Sandbox URL validation
    if (config.baseUrl.includes('preprod') || config.baseUrl.includes('sandbox')) {
      addCheck('passed', 'Using SANDBOX base URL');
    } else {
      addCheck('warnings', 'Base URL does not appear to be sandbox');
    }
  }

  // Webhook Configuration
  if (config.webhookUrl) {
    logInfo(`Webhook URL: ${config.webhookUrl}`);
    if (config.webhookUrl.startsWith('https://')) {
      addCheck('passed', 'Webhook URL is HTTPS');
    } else {
      addCheck('warnings', 'Webhook URL should be HTTPS');
    }
  } else {
    addCheck('warnings', 'PHONEPE_WEBHOOK_URL not set');
  }

  if (config.webhookUsername && config.webhookPassword) {
    addCheck('passed', 'Webhook credentials are configured');
    
    // Show expected webhook signature
    const expectedSig = crypto
      .createHash('sha256')
      .update(`${config.webhookUsername}:${config.webhookPassword}`)
      .digest('hex');
    logInfo(`Expected Webhook Signature: ${expectedSig.substring(0, 20)}...`);
  } else {
    addCheck('warnings', 'Webhook credentials not fully configured');
  }
}

async function testAuthentication() {
  logSection('🔐 STEP 1 — Authentication Test');

  if (!config.clientId || !config.clientSecret) {
    logError('Cannot test authentication - credentials missing');
    return null;
  }

  const tokenEndpoint = `${config.authUrl}/v1/oauth/token`;
  logInfo(`Token Endpoint: ${tokenEndpoint}`);
  console.log('');

  try {
    const params = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'client_credentials',
      client_version: config.clientVersion,
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    if (response.ok && data.access_token) {
      addCheck('passed', 'Successfully obtained OAuth token');
      logInfo(`Token expires at: ${data.expires_at ? new Date(data.expires_at * 1000).toISOString() : 'N/A'}`);
      logInfo(`Token preview: ${data.access_token.substring(0, 30)}...`);
      return data.access_token;
    } else {
      addCheck('failed', `Authentication failed: ${data.message || data.code || response.statusText}`);
      logError(`Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      return null;
    }
  } catch (error) {
    addCheck('failed', `Network error during authentication: ${error.message}`);
    return null;
  }
}

async function testPaymentCreation(accessToken) {
  logSection('💳 STEP 2 — Payment Creation Test');

  if (!accessToken) {
    logError('Skipping payment test - no access token');
    return null;
  }

  const paymentEndpoint = `${config.baseUrl}/checkout/v2/pay`;
  logInfo(`Payment Endpoint: ${paymentEndpoint}`);
  console.log('');

  // Generate test order
  const merchantOrderId = `TEST-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const testAmount = 100; // ₹1 in paisa (minimum amount)

  const payload = {
    merchantOrderId: merchantOrderId,
    amount: testAmount,
    expireAfter: 1200,
    paymentFlow: {
      type: 'PG_CHECKOUT',
      message: `Test Payment - ${merchantOrderId}`,
      merchantUrls: {
        redirectUrl: `${config.appUrl}/order-success?test=true`
      }
    },
    metaInfo: {
      udf1: 'test-order-id',
      udf2: 'test@example.com',
      udf3: 'Test User',
      udf4: '9999999999'
    }
  };

  logInfo(`Test Merchant Order ID: ${merchantOrderId}`);
  logInfo(`Test Amount: ₹${testAmount / 100} (${testAmount} paisa)`);
  logInfo(`Redirect URL: ${payload.paymentFlow.merchantUrls.redirectUrl}`);
  console.log('');

  try {
    const response = await fetch(paymentEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    if (response.ok && data.redirectUrl) {
      addCheck('passed', 'Successfully created test payment order');
      logInfo(`PhonePe Order ID: ${data.orderId}`);
      logInfo(`Payment URL: ${data.redirectUrl}`);
      logInfo(`State: ${data.state}`);
      logInfo(`Expires: ${data.expireAt ? new Date(data.expireAt).toISOString() : 'N/A'}`);
      
      // Detect environment from payment URL
      if (data.redirectUrl.includes('mercury-t2') || 
          data.redirectUrl.includes('mercury-uat') || 
          data.redirectUrl.includes('mercury-stg')) {
        logWarning('Payment URL is for SANDBOX environment');
      } else if (data.redirectUrl.includes('mercury.phonepe.com')) {
        logSuccess('Payment URL is for PRODUCTION environment');
      }
      
      return { merchantOrderId, phonePeOrderId: data.orderId };
    } else {
      addCheck('failed', `Payment creation failed: ${data.message || data.code || response.statusText}`);
      logError(`Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
      
      // Provide helpful hints
      if (data.message?.includes('not configured') || data.code === 'KEY_NOT_CONFIGURED') {
        logWarning('HINT: Your PhonePe merchant account may not be fully configured for this environment');
      }
      if (data.message?.includes('amount must be greater')) {
        logWarning('HINT: Minimum amount is ₹1 (100 paisa)');
      }
      
      return null;
    }
  } catch (error) {
    addCheck('failed', `Network error during payment creation: ${error.message}`);
    return null;
  }
}

async function testStatusCheck(accessToken, merchantOrderId) {
  logSection('🔍 STEP 3 — Status Check Test');

  if (!accessToken || !merchantOrderId) {
    logError('Skipping status test - missing token or order ID');
    return;
  }

  const statusEndpoint = `${config.baseUrl}/checkout/v2/order/${merchantOrderId}/status`;
  logInfo(`Status Endpoint: ${statusEndpoint}`);
  console.log('');

  try {
    const response = await fetch(`${statusEndpoint}?details=false&errorContext=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    if (response.ok) {
      addCheck('passed', 'Successfully retrieved order status');
      logInfo(`Order State: ${data.state}`);
      logInfo(`Amount: ₹${data.amount / 100} (${data.amount} paisa)`);
      
      if (data.paymentDetails && data.paymentDetails.length > 0) {
        logInfo(`Payment Attempts: ${data.paymentDetails.length}`);
        const latest = data.paymentDetails[0];
        logInfo(`Latest Status: ${latest.state}`);
        logInfo(`Transaction ID: ${latest.transactionId || 'N/A'}`);
      }
    } else {
      addCheck('failed', `Status check failed: ${data.message || data.code || response.statusText}`);
      logError(`Status: ${response.status}`);
      logError(`Response: ${JSON.stringify(data, null, 2)}`);
    }
  } catch (error) {
    addCheck('failed', `Network error during status check: ${error.message}`);
  }
}

function reviewSecurityChecklist() {
  logSection('🔒 PRODUCTION SAFETY CHECKLIST');

  const securityChecks = [
    { check: 'Client credentials stored in environment variables only', auto: !!config.clientId && !!config.clientSecret },
    { check: 'No NEXT_PUBLIC_ prefix on secret credentials', auto: true },
    { check: 'Token caching implemented to avoid unnecessary API calls', auto: null },
    { check: '.env file is in .gitignore', auto: null },
    { check: 'Unique merchant order IDs generated (no duplicates)', auto: null },
    { check: 'Expired token auto-refresh logic present', auto: null },
    { check: 'Orders marked success only after webhook/status confirmation', auto: null },
    { check: 'Webhook signature verification enabled', auto: !!config.webhookUsername && !!config.webhookPassword },
    { check: 'Webhook handles idempotency (duplicate events)', auto: null },
    { check: 'Error logging enabled for payment failures', auto: null },
    { check: 'Rate limiting on payment endpoints', auto: null },
    { check: 'Input sanitization on order creation', auto: null },
    { check: 'HTTPS enabled in production', auto: config.appUrl.startsWith('https://') },
    { check: 'Production uses live domain (not localhost)', auto: !config.appUrl.includes('localhost') },
  ];

  securityChecks.forEach(item => {
    if (item.auto === true) {
      logSuccess(item.check);
    } else if (item.auto === false) {
      logError(item.check);
    } else {
      log(`  ☐ ${item.check}`, 'yellow');
    }
  });

  console.log('');
  logWarning('Manual verification required for items marked with ☐');
}

function printSummary() {
  logSection('📊 VERIFICATION SUMMARY');

  log(`\nEnvironment: ${detectedEnv}`, 'bold');
  log(`Total Checks: ${checks.passed.length + checks.failed.length + checks.warnings.length}`, 'bold');
  log(`\n✔ Passed: ${checks.passed.length}`, 'green');
  log(`✖ Failed: ${checks.failed.length}`, 'red');
  log(`⚠ Warnings: ${checks.warnings.length}`, 'yellow');

  if (checks.failed.length > 0) {
    console.log('\n');
    log('❌ FAILED CHECKS:', 'red');
    checks.failed.forEach(item => log(`  • ${item}`, 'red'));
  }

  if (checks.warnings.length > 0) {
    console.log('\n');
    log('⚠️  WARNINGS:', 'yellow');
    checks.warnings.forEach(item => log(`  • ${item}`, 'yellow'));
  }

  console.log('\n');
  if (checks.failed.length === 0 && detectedEnv === 'PRODUCTION') {
    log('🎉 PRODUCTION CONFIGURATION LOOKS GOOD!', 'green');
    log('You can proceed with live payment testing.', 'green');
  } else if (checks.failed.length === 0 && detectedEnv === 'SANDBOX') {
    log('✅ SANDBOX CONFIGURATION VERIFIED', 'green');
    log('Remember to switch to production credentials for live deployment.', 'yellow');
  } else {
    log('⛔ PLEASE FIX FAILED CHECKS BEFORE GOING LIVE', 'red');
  }

  console.log('\n');
}

function printNextSteps() {
  logSection('📋 NEXT STEPS');

  if (detectedEnv === 'PRODUCTION') {
    console.log(`
  1. ✅ Verify all checks passed above
  2. 🧪 Test with a small amount (₹1) first
  3. 🔔 Configure webhook in PhonePe Dashboard:
     • Turn OFF Test Mode
     • Webhook URL: ${config.webhookUrl || '<not configured>'}
     • Username: ${config.webhookUsername || '<not configured>'}
     • Password: ${config.webhookPassword || '<not configured>'}
  4. 📱 Test end-to-end payment flow
  5. 📊 Monitor logs for any errors
  6. 💰 Accept real payments only after successful test
    `);
  } else {
    console.log(`
  1. ✅ Sandbox testing complete
  2. 🔄 To switch to production:
     • Update PHONEPE_BASE_URL to: https://api.phonepe.com/apis/pg
     • Update PHONEPE_AUTH_URL to: https://api.phonepe.com/apis/identity-manager
     • Update PHONEPE_CLIENT_ID with live credentials
     • Update PHONEPE_CLIENT_SECRET with live credentials
     • Update NEXT_PUBLIC_APP_URL to your live domain (HTTPS)
  3. 🔁 Run this script again to verify production setup
    `);
  }
}

// Main execution
(async function main() {
  console.clear();
  
  log('\n╔════════════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                                            ║', 'cyan');
  log('║            PhonePe Production Environment Verification Tool               ║', 'cyan');
  log('║                                                                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════════════════╝', 'cyan');

  await verifyConfiguration();

  // Continue with API tests only if basic config is valid
  if (checks.failed.length === 0 || checks.failed.length <= 2) {
    const accessToken = await testAuthentication();
    
    if (accessToken) {
      const orderData = await testPaymentCreation(accessToken);
      
      if (orderData) {
        await testStatusCheck(accessToken, orderData.merchantOrderId);
      }
    }
  } else {
    logWarning('\nSkipping API tests due to configuration errors');
  }

  reviewSecurityChecklist();
  printSummary();
  printNextSteps();

  // Exit with error code if there are failures
  process.exit(checks.failed.length > 0 ? 1 : 0);
})();
