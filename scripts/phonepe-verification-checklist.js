#!/usr/bin/env node

/**
 * PhonePe Sandbox Verification Checklist
 * 
 * Interactive checklist to guide you through PhonePe sandbox verification.
 * This ensures all components are working before production deployment.
 * 
 * Usage: node scripts/phonepe-verification-checklist.js
 */

const readline = require('readline');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function printHeader() {
  console.clear();
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║  PhonePe Sandbox Verification Checklist                  ║', 'bright');
  log('║  Complete all steps before going to production           ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝\n', 'cyan');
}

const steps = [
  {
    section: '🔧 STEP 1: Configuration Verification',
    items: [
      {
        task: 'Verify .env has PHONEPE_CLIENT_ID (sandbox)',
        action: 'Check .env file contains: PHONEPE_CLIENT_ID=M23BHBY0J6I85_2602091507',
      },
      {
        task: 'Verify .env has PHONEPE_CLIENT_SECRET (sandbox)',
        action: 'Check .env file contains: PHONEPE_CLIENT_SECRET=NWY3YjUzY2QtMWFhNy00MWFiLWIyMDItODAxNzA4OThjMThi',
      },
      {
        task: 'Verify PHONEPE_BASE_URL points to sandbox',
        action: 'Should be: https://api-preprod.phonepe.com/apis/pg-sandbox',
      },
      {
        task: 'Verify PHONEPE_AUTH_URL points to sandbox',
        action: 'Should be: https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
      },
      {
        task: 'Verify webhook credentials are set',
        action: 'Check PHONEPE_WEBHOOK_USERNAME and PHONEPE_WEBHOOK_PASSWORD in .env',
      },
    ],
  },
  {
    section: '🚀 STEP 2: Start Development Server',
    items: [
      {
        task: 'Start dev server on port 3000',
        action: 'Run: npm run dev',
        command: 'npm run dev',
      },
      {
        task: 'Verify server is running',
        action: 'Visit: http://localhost:3000',
      },
      {
        task: 'Check for any startup errors',
        action: 'Look at terminal console for error messages',
      },
    ],
  },
  {
    section: '🔐 STEP 3: OAuth Token Verification',
    items: [
      {
        task: 'Run automated test script',
        action: 'Run: node scripts/test-phonepe-sandbox.js',
        command: 'node scripts/test-phonepe-sandbox.js',
      },
      {
        task: 'Visit diagnostic endpoint',
        action: 'Open: http://localhost:3000/api/payment/phonepe/test',
      },
      {
        task: 'Verify OAuth token is generated successfully',
        action: 'Response should show: "success": true, "hasToken": true',
      },
      {
        task: 'Confirm environment is SANDBOX',
        action: 'Response should show: "phonePeEnvironment": "SANDBOX"',
      },
    ],
  },
  {
    section: '💳 STEP 4: Payment Creation Test',
    items: [
      {
        task: 'Add test product to cart (amount ≥ ₹1)',
        action: 'Navigate to products page and add item to cart',
      },
      {
        task: 'Go to checkout page',
        action: 'Visit: http://localhost:3000/checkout',
      },
      {
        task: 'Fill in shipping details',
        action: 'Enter test data: Name, Email, Phone (10 digits), Address',
      },
      {
        task: 'Select "Online Payment" → "PhonePe"',
        action: 'Choose PhonePe as payment gateway',
      },
      {
        task: 'Click "Place Order" button',
        action: 'Should redirect to PhonePe sandbox payment page',
      },
      {
        task: 'Verify payment URL contains sandbox domain',
        action: 'URL should have: mercury-uat, mercury-stg, or mercury-t2',
      },
      {
        task: 'Check console for payment creation logs',
        action: 'Terminal should show: "PhonePe payment created successfully"',
      },
    ],
  },
  {
    section: '🖥️  STEP 5: PhonePe Payment Page Testing',
    items: [
      {
        task: 'Test successful payment',
        action: 'Complete payment on PhonePe sandbox (auto-approved)',
      },
      {
        task: 'Test payment cancellation',
        action: 'Click "Cancel" on PhonePe payment page',
      },
      {
        task: 'Test payment timeout',
        action: 'Wait without completing payment (expires in 20 min)',
      },
      {
        task: 'Verify redirect after each scenario',
        action: 'Should redirect to: /order-success?orderId={id}',
      },
    ],
  },
  {
    section: '🔍 STEP 6: Payment Status Verification',
    items: [
      {
        task: 'Verify status polling on order-success page',
        action: 'Open DevTools Network tab, see requests to /api/payment/phonepe/status',
      },
      {
        task: 'Confirm polling interval is 3 seconds',
        action: 'Status checks should occur every 3 seconds',
      },
      {
        task: 'Verify max 10 polling attempts',
        action: 'After 30 seconds, should show timeout message',
      },
      {
        task: 'Check order status updates in database',
        action: 'Order should change from pending_payment to completed/failed',
      },
      {
        task: 'Verify stock deduction on success',
        action: 'Product stock should decrease only after COMPLETED status',
      },
    ],
  },
  {
    section: '🔔 STEP 7: Webhook Testing (Requires Tunnel)',
    items: [
      {
        task: 'Install ngrok or localtunnel',
        action: 'Run: npm install -g ngrok  OR  npx localtunnel',
      },
      {
        task: 'Start tunnel to localhost:3000',
        action: 'Run: ngrok http 3000  OR  npx localtunnel --port 3000',
      },
      {
        task: 'Copy public URL from tunnel',
        action: 'Example: https://abc123.ngrok.io',
      },
      {
        task: 'Configure PhonePe Sandbox Dashboard webhook',
        action: 'Set webhook URL: https://{tunnel-url}/api/payment/phonepe/webhook',
      },
      {
        task: 'Set webhook username in PhonePe Dashboard',
        action: 'Username: chulbuli_webhook',
      },
      {
        task: 'Set webhook password in PhonePe Dashboard',
        action: 'Password: Khushi@1232',
      },
      {
        task: 'Enable webhook events in dashboard',
        action: 'Enable: checkout.order.completed, checkout.order.failed',
      },
      {
        task: 'Make test payment and verify webhook received',
        action: 'Terminal should log: "PhonePe Webhook Received"',
      },
      {
        task: 'Verify webhook signature validation',
        action: 'Webhook should validate SHA256(username:password)',
      },
      {
        task: 'Check WebhookLog table in database',
        action: 'Should have entry with status: "processed"',
      },
      {
        task: 'Test webhook idempotency',
        action: 'Duplicate webhooks should be skipped (log: "already processed")',
      },
    ],
  },
  {
    section: '🧪 STEP 8: Local Webhook Simulation (No Tunnel)',
    items: [
      {
        task: 'Find merchantOrderId from a pending order',
        action: 'Check database or order creation response',
      },
      {
        task: 'Run webhook simulation for SUCCESS',
        action: 'Run: node scripts/simulate-phonepe-webhook.js {merchantOrderId} success',
        command: 'node scripts/simulate-phonepe-webhook.js CHULBULI-XXX-YYY success',
      },
      {
        task: 'Verify order marked as completed',
        action: 'Check database: order status should be "completed"',
      },
      {
        task: 'Run webhook simulation for FAILED',
        action: 'Run: node scripts/simulate-phonepe-webhook.js {merchantOrderId} failed',
        command: 'node scripts/simulate-phonepe-webhook.js CHULBULI-XXX-YYY failed',
      },
      {
        task: 'Verify order marked as failed',
        action: 'Check database: order status should be "failed"',
      },
    ],
  },
  {
    section: '⚠️  STEP 9: Edge Case Testing',
    items: [
      {
        task: 'Test minimum amount (exactly ₹1)',
        action: 'Create order with total = ₹1, should succeed',
      },
      {
        task: 'Test below minimum amount (< ₹1)',
        action: 'Should show error: "PhonePe requires minimum ₹1"',
      },
      {
        task: 'Test empty cart checkout',
        action: 'Should show error: "Cart is empty"',
      },
      {
        task: 'Test invalid phone number',
        action: 'Should show error: "Invalid phone number format"',
      },
      {
        task: 'Test invalid email',
        action: 'Should show error: "Invalid email format"',
      },
      {
        task: 'Test out-of-stock product',
        action: 'Should show error: "Insufficient stock"',
      },
    ],
  },
  {
    section: '✅ STEP 10: Final Verification',
    items: [
      {
        task: 'All automated tests pass',
        action: 'node scripts/test-phonepe-sandbox.js shows 100% pass rate',
      },
      {
        task: 'Successful payment flow works end-to-end',
        action: 'Checkout → PhonePe → Success → Status Update → Stock Deduction',
      },
      {
        task: 'Failed payment flow handled gracefully',
        action: 'Checkout → PhonePe → Cancel → Failed Page → No Stock Change',
      },
      {
        task: 'Webhook signature validation working',
        action: 'Valid signatures accepted, invalid signatures rejected',
      },
      {
        task: 'Database updates correctly',
        action: 'Orders, stock, webhook logs all updating as expected',
      },
      {
        task: 'No errors in server console',
        action: 'Terminal logs clean with no uncaught exceptions',
      },
    ],
  },
];

function printChecklist() {
  printHeader();
  
  steps.forEach((step, stepIndex) => {
    log(`\n${step.section}`, 'bright');
    log('─'.repeat(60), 'dim');
    
    step.items.forEach((item, itemIndex) => {
      const number = `${stepIndex + 1}.${itemIndex + 1}`;
      log(`\n  ${number.padEnd(6)} ☐ ${item.task}`, 'cyan');
      log(`         └─ ${item.action}`, 'dim');
      
      if (item.command) {
        log(`         └─ Command: ${item.command}`, 'yellow');
      }
    });
  });
  
  log('\n' + '═'.repeat(60), 'cyan');
  log('\n📋 QUICK COMMAND REFERENCE:', 'bright');
  log('─'.repeat(60), 'dim');
  log('  Start dev server:       npm run dev', 'green');
  log('  Run automated tests:    node scripts/test-phonepe-sandbox.js', 'green');
  log('  Simulate webhook:       node scripts/simulate-phonepe-webhook.js <orderId> success', 'green');
  log('  Check diagnostic:       http://localhost:3000/api/payment/phonepe/test', 'green');
  log('  Start ngrok tunnel:     ngrok http 3000', 'green');
  log('  Start localtunnel:      npx localtunnel --port 3000', 'green');
  
  log('\n💡 IMPORTANT NOTES:', 'bright');
  log('─'.repeat(60), 'dim');
  log('  • Always verify sandbox before production', 'yellow');
  log('  • Webhook testing requires public URL (ngrok/localtunnel)', 'yellow');
  log('  • PhonePe minimum payment: ₹1 (100 paisa)', 'yellow');
  log('  • Keep sandbox credentials separate from production', 'yellow');
  log('  • Test both success and failure scenarios', 'yellow');
  
  log('\n🔒 SECURITY REMINDERS:', 'bright');
  log('─'.repeat(60), 'dim');
  log('  • Never commit .env files to git', 'red');
  log('  • Rotate credentials periodically', 'red');
  log('  • Always verify webhook signatures', 'red');
  log('  • Implement rate limiting on payment APIs', 'red');
  log('  • Log all payment transactions for audit', 'red');
  
  log('\n' + '═'.repeat(60), 'cyan');
  log('\n🎯 Next Steps:', 'bright');
  log('  1. Follow this checklist step by step', 'cyan');
  log('  2. Mark each item as complete after verification', 'cyan');
  log('  3. Document any issues encountered', 'cyan');
  log('  4. Only proceed to production after ALL tests pass\n', 'cyan');
}

// Main execution
printChecklist();
