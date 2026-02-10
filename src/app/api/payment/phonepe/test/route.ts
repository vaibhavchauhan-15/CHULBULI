/**
 * PhonePe Configuration Diagnostic Endpoint
 * 
 * This endpoint tests PhonePe configuration and provides diagnostic information.
 * Access: http://localhost:3000/api/payment/phonepe/test
 * Production: https://your-domain.com/api/payment/phonepe/test
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPhonePeToken } from '@/lib/phonepe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = (process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg').trim().replace(/\/+$/, '');
    const authUrl = (process.env.PHONEPE_AUTH_URL || 'https://api.phonepe.com/apis/identity-manager').trim().replace(/\/+$/, '');
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000').trim().replace(/\/+$/, '');
    const clientVersion = (process.env.PHONEPE_CLIENT_VERSION || '1').trim();
    const isProd = baseUrl.includes('api.phonepe.com');
    
    const diagnostics = {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      phonePeEnvironment: isProd ? 'PRODUCTION' : 'SANDBOX',
      config: {
        clientId: process.env.PHONEPE_CLIENT_ID ? 
          `${process.env.PHONEPE_CLIENT_ID.trim().substring(0, 15)}...` : 
          '❌ NOT SET',
        clientSecret: process.env.PHONEPE_CLIENT_SECRET ? '✅ SET (Hidden)' : '❌ NOT SET',
        clientVersion: clientVersion,
        baseUrl: baseUrl,
        authUrl: authUrl,
        appUrl: appUrl,
        expectedEndpoints: {
          token: `${authUrl}/v1/oauth/token`,
          createPayment: `${baseUrl}/checkout/v2/pay`,
          checkStatus: `${baseUrl}/checkout/v2/order/{merchantOrderId}/status`,
        }
      },
      tests: [] as any[],
    };

    // Test 1: Environment variables check
    if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET) {
      diagnostics.tests.push({
        name: 'Environment Variables',
        status: 'FAILED',
        message: 'Required environment variables are missing',
        fix: 'Set PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET in .env.local'
      });
      
      return NextResponse.json({
        success: false,
        message: 'PhonePe is not configured',
        diagnostics,
      });
    }

    diagnostics.tests.push({
      name: 'Environment Variables',
      status: 'PASSED',
      message: 'All required environment variables are set'
    });

    // Test 2: OAuth token test with detailed logging
    try {
      console.log('🔍 Testing PhonePe OAuth token generation...');
      const tokenStartTime = Date.now();
      const tokenData = await getPhonePeToken(true); // Force fresh token for testing
      const tokenDuration = Date.now() - tokenStartTime;
      
      if (tokenData.access_token) {
        const expiresIn = tokenData.expires_at ? 
          tokenData.expires_at - Math.floor(Date.now() / 1000) : 
          null;
        
        diagnostics.tests.push({
          name: 'OAuth Authentication',
          status: 'PASSED',
          message: '✅ Successfully obtained OAuth access token',
          details: {
            tokenLength: tokenData.access_token.length,
            tokenObtainedIn: `${tokenDuration}ms`,
            expiresAt: tokenData.expires_at ? 
              new Date(tokenData.expires_at * 1000).toISOString() : 'Not provided',
            expiresIn: expiresIn ? `${Math.floor(expiresIn / 3600)} hours` : 'Unknown',
            tokenPrefix: tokenData.access_token.substring(0, 20) + '...',
          }
        });

        // Test 3: Merchant ID validation
        const clientId = process.env.PHONEPE_CLIENT_ID!;
        const merchantIdMatch = clientId.match(/^([A-Z0-9]+)_?/);
        const merchantId = merchantIdMatch ? merchantIdMatch[1] : clientId;
        
        diagnostics.tests.push({
          name: 'Merchant ID Extraction',
          status: 'PASSED',
          message: `Merchant ID: ${merchantId}`,
          note: 'This should match your PhonePe Business Dashboard merchant ID'
        });

        // Test 4: Warn about production setup
        if (isProd) {
          diagnostics.tests.push({
            name: 'Production Environment Check',
            status: 'INFO',
            message: '🏭 Running in PRODUCTION mode',
            warnings: [
              'Make sure your merchant account is approved and activated by PhonePe',
              'Standard Checkout API must be enabled in your PhonePe Business Dashboard',
              'Test with small amount first before going live',
            ]
          });
        } else {
          diagnostics.tests.push({
            name: 'Sandbox Environment Check',
            status: 'INFO',
            message: '🧪 Running in SANDBOX mode',
            note: 'This is good for testing. Switch to production URLs when ready to go live.'
          });
        }

        return NextResponse.json({
          success: true,
          message: '✅ PhonePe OAuth authentication is working successfully!',
          diagnostics,
          recommendations: [
            '✅ OAuth authentication is configured correctly',
            '✅ Token generation is working',
            '',
            '📋 Next Steps:',
            isProd ? 
              '1. Verify your merchant account is activated for production' :
              '1. Test payment creation in sandbox mode',
            '2. Try creating a test payment through checkout',
            '3. If you see "KEY_NOT_CONFIGURED" or "MERCHANT_NOT_CONFIGURED":',
            '   → Contact PhonePe Business Support',
            '   → Request activation of "Standard Checkout API"',
            '   → Verify credentials from PhonePe Business Dashboard',
            '',
            '💡 Alternative Payment Methods:',
            '   • Razorpay is already configured as backup',
            '   • Cash on Delivery is available',
          ],
          troubleshooting: {
            'KEY_NOT_CONFIGURED': 'Your merchant account needs Standard Checkout API activation. Contact PhonePe support.',
            'UNAUTHORIZED': 'Invalid credentials. Verify Client ID and Client Secret in environment variables.',
            'BAD_REQUEST': 'Check the payload format. This usually means API version mismatch or invalid fields.',
            'MINIMUM_AMOUNT': 'PhonePe requires minimum ₹1 (100 paisa) for payment.',
          }
        });
      }
    } catch (tokenError: any) {
      console.error('❌ PhonePe token test failed:', tokenError);
      diagnostics.tests.push({
        name: 'OAuth Authentication',
        status: 'FAILED',
        message: '❌ Failed to obtain OAuth token',
        error: tokenError.message,
      });

      return NextResponse.json({
        success: false,
        message: 'PhonePe OAuth authentication failed',
        diagnostics,
        recommendations: [
          '❌ Check PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET are correct',
          '❌ Verify credentials are from PhonePe Business Dashboard',
          '❌ Ensure you have access to PhonePe API (not expired or revoked)',
          '❌ Check if using correct environment (sandbox vs production)',
        ]
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      message: 'Unable to complete diagnostic tests',
      diagnostics,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Diagnostic test failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
