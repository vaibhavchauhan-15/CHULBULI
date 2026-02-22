/**
 * PhonePe Environment Verification Endpoint (Production-Safe)
 * 
 * This endpoint verifies PhonePe environment configuration without exposing secrets.
 * Access: https://your-domain.com/api/payment/phonepe/verify-env
 * 
 * Returns environment info (safe for production) to help debug configuration issues.
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get configuration without exposing secrets
    const baseUrl = (process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg')
      .trim()
      .replace(/\/+$/, '');
    const authUrl = (process.env.PHONEPE_AUTH_URL || 'https://api.phonepe.com/apis/identity-manager')
      .trim()
      .replace(/\/+$/, '');
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000')
      .trim()
      .replace(/\/+$/, '');

    // Detect environment from URLs
    const isSandbox = baseUrl.includes('preprod') || 
                     baseUrl.includes('sandbox') ||
                     authUrl.includes('preprod') || 
                     authUrl.includes('sandbox');
    
    const detectedEnv = isSandbox ? 'SANDBOX' : 'PRODUCTION';

    // Validation checks
    const checks = {
      hasClientId: !!process.env.PHONEPE_CLIENT_ID,
      hasClientSecret: !!process.env.PHONEPE_CLIENT_SECRET,
      hasWebhookCredentials: !!(process.env.PHONEPE_WEBHOOK_USERNAME && process.env.PHONEPE_WEBHOOK_PASSWORD),
      urlsMatch: (isSandbox && baseUrl.includes('sandbox')) || 
                (!isSandbox && baseUrl.includes('api.phonepe.com')),
      httpsEnabled: appUrl.startsWith('https://'),
      notLocalhost: !appUrl.includes('localhost') && !appUrl.includes('127.0.0.1'),
    };

    // Production URL validation
    const expectedUrls = {
      sandbox: {
        baseUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
        authUrl: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
        paymentDomain: 'mercury-stg.phonepe.com',
      },
      production: {
        baseUrl: 'https://api.phonepe.com/apis/pg',
        authUrl: 'https://api.phonepe.com/apis/identity-manager',
        paymentDomain: 'mercury.phonepe.com',
      },
    };

    const expected = detectedEnv === 'SANDBOX' ? expectedUrls.sandbox : expectedUrls.production;
    
    const urlValidation = {
      baseUrlCorrect: baseUrl === expected.baseUrl,
      authUrlCorrect: authUrl === expected.authUrl,
    };

    // Overall status
    const isConfigValid = checks.hasClientId && 
                         checks.hasClientSecret && 
                         urlValidation.baseUrlCorrect &&
                         urlValidation.authUrlCorrect;

    const response = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      detectedEnvironment: detectedEnv,
      isProduction: detectedEnv === 'PRODUCTION',
      isConfigValid,
      
      // Configuration (safe to expose)
      configuration: {
        baseUrl,
        authUrl,
        appUrl,
        clientIdPrefix: process.env.PHONEPE_CLIENT_ID?.trim().substring(0, 20) + '...' || 'NOT_SET',
      },

      // Validation results
      checks: {
        '✅ Client ID configured': checks.hasClientId,
        '✅ Client Secret configured': checks.hasClientSecret,
        '✅ Webhook credentials configured': checks.hasWebhookCredentials,
        '✅ HTTPS enabled': checks.httpsEnabled || detectedEnv === 'SANDBOX',
        '✅ Not localhost': checks.notLocalhost || detectedEnv === 'SANDBOX',
        '✅ Base URL matches environment': urlValidation.baseUrlCorrect,
        '✅ Auth URL matches environment': urlValidation.authUrlCorrect,
      },

      // Expected endpoints
      endpoints: {
        token: `${authUrl}/v1/oauth/token`,
        createPayment: `${baseUrl}/checkout/v2/pay`,
        checkStatus: `${baseUrl}/checkout/v2/order/{merchantOrderId}/status`,
        webhook: `${appUrl}/api/payment/phonepe/webhook`,
      },

      // Expected vs actual
      expected: {
        baseUrl: expected.baseUrl,
        authUrl: expected.authUrl,
        paymentDomain: expected.paymentDomain,
      },

      // Recommendations
      recommendations: [] as string[],
    };

    // Add recommendations based on findings
    if (detectedEnv === 'PRODUCTION') {
      if (!urlValidation.baseUrlCorrect) {
        response.recommendations.push(
          `⚠️ Base URL should be: ${expected.baseUrl}`
        );
      }
      if (!urlValidation.authUrlCorrect) {
        response.recommendations.push(
          `⚠️ Auth URL should be: ${expected.authUrl}`
        );
      }
      if (!checks.httpsEnabled) {
        response.recommendations.push(
          '⚠️ Production requires HTTPS for app URL'
        );
      }
      if (!checks.notLocalhost) {
        response.recommendations.push(
          '⚠️ Production cannot use localhost URLs'
        );
      }
      if (!checks.hasWebhookCredentials) {
        response.recommendations.push(
          '⚠️ Configure PHONEPE_WEBHOOK_USERNAME and PHONEPE_WEBHOOK_PASSWORD'
        );
      }
    }

    if (!checks.hasClientId || !checks.hasClientSecret) {
      response.recommendations.push(
        '❌ Missing PhonePe credentials. Set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET'
      );
    }

    // Final verdict
    if (isConfigValid && detectedEnv === 'PRODUCTION') {
      response.recommendations.push(
        '✅ Configuration looks correct for PRODUCTION environment!'
      );
    } else if (isConfigValid && detectedEnv === 'SANDBOX') {
      response.recommendations.push(
        '✅ Configuration looks correct for SANDBOX environment!'
      );
    } else {
      response.recommendations.push(
        '❌ Please fix the issues above before processing payments'
      );
    }

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Configuration verification failed',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
