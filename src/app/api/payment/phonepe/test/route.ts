/**
 * PhonePe Configuration Diagnostic Endpoint
 * 
 * This endpoint tests PhonePe configuration and provides diagnostic information.
 * Access: http://localhost:3000/api/payment/phonepe/test
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPhonePeToken } from '@/lib/phonepe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const diagnostics = {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      config: {
        clientId: process.env.PHONEPE_CLIENT_ID ? 
          `${process.env.PHONEPE_CLIENT_ID.substring(0, 10)}...` : 
          '❌ NOT SET',
        clientSecret: process.env.PHONEPE_CLIENT_SECRET ? '✅ SET' : '❌ NOT SET',
        baseUrl: process.env.PHONEPE_BASE_URL || 'Using default',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Using default',
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

    // Test 2: OAuth token test
    try {
      const tokenData = await getPhonePeToken();
      
      if (tokenData.access_token) {
        diagnostics.tests.push({
          name: 'OAuth Authentication',
          status: 'PASSED',
          message: 'Successfully obtained OAuth access token',
          tokenExpiresIn: tokenData.expires_in,
        });

        // Test 3: Extract merchant ID
        const merchantId = process.env.PHONEPE_CLIENT_ID!.split('_')[0];
        diagnostics.tests.push({
          name: 'Merchant ID Extraction',
          status: 'PASSED',
          message: `Merchant ID: ${merchantId}`,
        });

        // Test shows OAuth works but merchant might not be configured for Standard Checkout
        diagnostics.tests.push({
          name: 'Payment API Status',
          status: 'WARNING',
          message: 'Merchant configuration for Standard Checkout cannot be tested without creating an actual payment',
          note: 'If you see KEY_NOT_CONFIGURED error during checkout, contact PhonePe support to activate Standard Checkout API',
        });

        return NextResponse.json({
          success: true,
          message: 'PhonePe OAuth authentication is working. However, Standard Checkout may require additional merchant configuration.',
          diagnostics,
          recommendations: [
            '✅ OAuth authentication is working correctly',
            '⚠️ If you encounter "KEY_NOT_CONFIGURED" error during payment:',
            '   1. Contact PhonePe Business Support',
            '   2. Request activation of "Standard Checkout API" for your merchant account',
            '   3. Verify merchant account is approved and activated',
            '   4. Ensure credentials are from PhonePe Business Dashboard (not demo/test)',
            '',
            '💡 Alternative: Use Razorpay payment gateway which is already configured',
          ]
        });
      }
    } catch (tokenError: any) {
      diagnostics.tests.push({
        name: 'OAuth Authentication',
        status: 'FAILED',
        message: 'Failed to obtain OAuth token',
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
