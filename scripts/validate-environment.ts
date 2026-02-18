#!/usr/bin/env node
/**
 * Environment Configuration Validation Script
 * 
 * This script validates that all environment variables are properly configured
 * and detects potential issues before deployment.
 * 
 * Usage:
 *   npm run env:validate
 *   ts-node scripts/validate-environment.ts
 * 
 * Features:
 * - Validates all required environment variables
 * - Checks for insecure configurations (e.g., test keys in production)
 * - Verifies URL formats and credentials strength
 * - Provides actionable error messages
 * - Can be run in CI/CD pipelines
 */

import * as fs from 'fs';
import * as path from 'path';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

interface ValidationResult {
  variable: string;
  status: 'pass' | 'warning' | 'error' | 'info';
  message: string;
}

const results: ValidationResult[] = [];

function log(status: 'pass' | 'warning' | 'error' | 'info', variable: string, message: string) {
  results.push({ variable, status, message });
}

function printResults() {
  console.log('\n' + colors.bold + '═'.repeat(80) + colors.reset);
  console.log(colors.bold + colors.cyan + '  ENVIRONMENT CONFIGURATION VALIDATION REPORT' + colors.reset);
  console.log(colors.bold + '═'.repeat(80) + colors.reset + '\n');

  const errors = results.filter(r => r.status === 'error');
  const warnings = results.filter(r => r.status === 'warning');
  const passed = results.filter(r => r.status === 'pass');
  const info = results.filter(r => r.status === 'info');

  // Print errors
  if (errors.length > 0) {
    console.log(colors.red + colors.bold + '❌ ERRORS:' + colors.reset);
    errors.forEach(({ variable, message }) => {
      console.log(`   ${colors.red}✗${colors.reset} ${colors.bold}${variable}${colors.reset}: ${message}`);
    });
    console.log('');
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(colors.yellow + colors.bold + '⚠️  WARNINGS:' + colors.reset);
    warnings.forEach(({ variable, message }) => {
      console.log(`   ${colors.yellow}⚠${colors.reset} ${colors.bold}${variable}${colors.reset}: ${message}`);
    });
    console.log('');
  }

  // Print info
  if (info.length > 0) {
    console.log(colors.blue + colors.bold + 'ℹ️  INFO:' + colors.reset);
    info.forEach(({ variable, message }) => {
      console.log(`   ${colors.blue}ℹ${colors.reset} ${colors.bold}${variable}${colors.reset}: ${message}`);
    });
    console.log('');
  }

  // Summary
  console.log(colors.bold + '─'.repeat(80) + colors.reset);
  console.log(colors.bold + 'SUMMARY:' + colors.reset);
  console.log(`   ${colors.green}✓ Passed${colors.reset}: ${passed.length}`);
  console.log(`   ${colors.yellow}⚠ Warnings${colors.reset}: ${warnings.length}`);
  console.log(`   ${colors.red}✗ Errors${colors.reset}: ${errors.length}`);
  console.log(colors.bold + '═'.repeat(80) + colors.reset + '\n');

  if (errors.length > 0) {
    console.log(colors.red + colors.bold + 'VALIDATION FAILED!' + colors.reset);
    console.log('Fix the errors above before deploying to production.\n');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(colors.yellow + colors.bold + 'VALIDATION PASSED WITH WARNINGS' + colors.reset);
    console.log('Review the warnings above and fix them if needed.\n');
    process.exit(0);
  } else {
    console.log(colors.green + colors.bold + '✅ ALL CHECKS PASSED!' + colors.reset);
    console.log('Environment is properly configured.\n');
    process.exit(0);
  }
}

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('warning', 'ENV_FILE', '.env.local file not found. Using process.env only.');
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        // Don't override existing env vars
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }

  log('pass', 'ENV_FILE', '.env.local loaded successfully');
}

// Detect environment
function detectEnvironment(): 'development' | 'preview' | 'production' {
  const vercelEnv = process.env.VERCEL_ENV;
  const nodeEnv = process.env.NODE_ENV;

  if (vercelEnv === 'production') return 'production';
  if (vercelEnv === 'preview') return 'preview';
  if (nodeEnv === 'production') return 'production';
  if (nodeEnv === 'development') return 'development';

  return 'development';
}

// Validation functions
function checkRequired(varName: string, description: string) {
  const value = process.env[varName];
  if (!value || value.trim() === '' || value.includes('your_') || value.includes('_here')) {
    log('error', varName, `Missing or placeholder value. ${description}`);
    return false;
  }
  log('pass', varName, 'Configured');
  return true;
}

function checkOptional(varName: string, description: string) {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    log('info', varName, `Optional: ${description}`);
    return false;
  }
  if (value.includes('your_') || value.includes('_here')) {
    log('warning', varName, `Using placeholder value. ${description}`);
    return false;
  }
  log('pass', varName, 'Configured');
  return true;
}

function checkUrl(varName: string, description: string) {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    log('error', varName, `Missing. ${description}`);
    return false;
  }

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      log('error', varName, 'Must be an HTTP or HTTPS URL');
      return false;
    }
    log('pass', varName, `Valid URL: ${url.protocol}//${url.host}`);
    return true;
  } catch {
    log('error', varName, `Invalid URL format. ${description}`);
    return false;
  }
}

function checkJWTSecret() {
  const varName = 'JWT_SECRET';
  const value = process.env[varName];

  if (!value || value.trim() === '') {
    log('error', varName, 'Missing. JWT secret is required for authentication.');
    return;
  }

  if (value.includes('your_') || value.includes('_here')) {
    log('error', varName, 'Using placeholder value. Generate a secure secret.');
    return;
  }

  if (value.length < 32) {
    log('error', varName, `Too short (${value.length} chars). Must be at least 32 characters for security.`);
    return;
  }

  if (value === 'your-secret-key' || value === 'secret') {
    log('error', varName, 'Using insecure default value. Generate a secure random secret.');
    return;
  }

  log('pass', varName, `Secure (${value.length} characters)`);
}

function checkPhonePeEnvironment(env: string) {
  const baseUrl = process.env.PHONEPE_BASE_URL;
  const authUrl = process.env.PHONEPE_AUTH_URL;

  if (!baseUrl && !authUrl) {
    log('info', 'PHONEPE_*_URL', 'Not explicitly set. Will use defaults based on environment.');
    return;
  }

  const isSandbox = baseUrl?.includes('preprod') || baseUrl?.includes('sandbox') ||
                    authUrl?.includes('preprod') || authUrl?.includes('sandbox');

  if (env === 'production' && isSandbox) {
    log('error', 'PHONEPE_BASE_URL', 'Using sandbox URL in production! Switch to production URLs.');
  } else if (env === 'development' && !isSandbox && baseUrl) {
    log('warning', 'PHONEPE_BASE_URL', 'Using production URL in development. Consider using sandbox for testing.');
  } else if (baseUrl) {
    log('pass', 'PHONEPE_BASE_URL', `Correctly configured for ${env}`);
  }
}

function checkProductionSafety(env: string) {
  if (env !== 'production') {
    log('info', 'ENVIRONMENT', `Running in ${env} mode - production checks skipped`);
    return;
  }

  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  
  if (appUrl && appUrl.includes('localhost')) {
    log('error', 'APP_URL', 'Using localhost in production. Set to your production domain.');
  }

  if (appUrl && !appUrl.startsWith('https://')) {
    log('error', 'APP_URL', 'Production must use HTTPS for security.');
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || cronSecret.length < 20) {
    log('warning', 'CRON_SECRET', 'Weak or missing cron secret. Generate a secure random string.');
  }

  const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME;
  const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD;
  if (!webhookUsername || !webhookPassword) {
    log('warning', 'PHONEPE_WEBHOOK_*', 'Webhook credentials not configured. PhonePe webhooks may fail verification.');
  }
}

// Main validation
function main() {
  console.log('\n' + colors.bold + colors.cyan + 'Starting environment validation...' + colors.reset + '\n');

  // Load env file
  loadEnvFile();

  // Detect environment
  const env = detectEnvironment();
  log('info', 'NODE_ENV', `Detected environment: ${env}`);

  // Required variables
  console.log('Checking required variables...');
  checkRequired('PHONEPE_CLIENT_ID', 'PhonePe OAuth Client ID from merchant dashboard');
  checkRequired('PHONEPE_CLIENT_SECRET', 'PhonePe OAuth Client Secret from merchant dashboard');
  checkRequired('NEXT_PUBLIC_SUPABASE_URL', 'Supabase project URL');
  checkRequired('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Supabase anonymous key');
  checkRequired('NEXT_PUBLIC_FIREBASE_API_KEY', 'Firebase API key');
  checkRequired('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'Firebase auth domain');
  checkRequired('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'Firebase project ID');
  checkRequired('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'Firebase storage bucket');
  checkRequired('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'Firebase messaging sender ID');
  checkRequired('NEXT_PUBLIC_FIREBASE_APP_ID', 'Firebase app ID');
  checkRequired('CLOUDINARY_CLOUD_NAME', 'Cloudinary cloud name');
  checkRequired('CLOUDINARY_API_KEY', 'Cloudinary API key');
  checkRequired('CLOUDINARY_API_SECRET', 'Cloudinary API secret');
  checkJWTSecret();

  // URL validation
  console.log('\nValidating URLs...');
  if (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL) {
    checkUrl('APP_URL', 'Application public URL') || checkUrl('NEXT_PUBLIC_APP_URL', 'Application public URL');
  } else {
    log('warning', 'APP_URL', 'Not set. Will use VERCEL_URL if deployed on Vercel.');
  }

  checkUrl('NEXT_PUBLIC_SUPABASE_URL', 'Supabase project URL');

  // Optional but recommended
  console.log('\nChecking optional variables...');
  checkOptional('DATABASE_URL', 'Direct database connection URL for migrations');
  checkOptional('FIREBASE_SERVICE_ACCOUNT_KEY', 'Firebase admin service account for server-side operations');
  checkOptional('CRON_SECRET', 'Secret for authenticating cron job requests');
  checkOptional('PHONEPE_WEBHOOK_USERNAME', 'PhonePe webhook username for signature verification');
  checkOptional('PHONEPE_WEBHOOK_PASSWORD', 'PhonePe webhook password for signature verification');
  checkOptional('CSRF_SECRET', 'CSRF protection secret');

  // Environment-specific checks
  console.log('\nValidating environment-specific configuration...');
  checkPhonePeEnvironment(env);
  checkProductionSafety(env);

  // Print results
  printResults();
}

// Run validation
main();
