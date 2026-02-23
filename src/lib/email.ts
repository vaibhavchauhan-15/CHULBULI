import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  quantity: number;
  price: string | number;
}

interface OrderEmailData {
  id: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  totalPrice: string | number;
  paymentMethod: string;
  paymentProvider?: string;
  transactionId?: string | null;
  items: OrderItem[];
}

/**
 * Send order confirmation email to customer
 * Handles both COD and Online Payment orders
 */
export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  try {
    // Build items HTML - mobile-friendly table rows with explicit backgrounds
    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr style="border-bottom: 1px solid #E8D5C2; background-color: #ffffff;">
            <td style="padding: 12px 10px; color: #5A3E2B; font-size: 14px; background-color: #ffffff;">${item.name}</td>
            <td style="padding: 12px 10px; text-align: center; color: #5A3E2B; font-size: 14px; background-color: #ffffff;">${item.quantity}</td>
            <td style="padding: 12px 10px; text-align: right; color: #5A3E2B; font-size: 14px; font-weight: 600; background-color: #ffffff;">₹${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</td>
          </tr>`
      )
      .join("");

    // Build payment details HTML based on payment method - table-based with explicit backgrounds
    const paymentDetails =
      order.paymentMethod === "cod"
        ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFF8E1; border-left: 4px solid #FFB74D; border-radius: 8px;">
             <tr>
               <td style="padding: 15px; background-color: #FFF8E1;">
                 <p style="margin: 0 0 8px 0; font-size: 15px; color: #5A3E2B; font-weight: 600;">💰 Payment Method: Cash on Delivery (COD)</p>
                 <p style="margin: 0; font-size: 14px; color: #8B6914; line-height: 1.5;">Please keep exact amount ready at delivery.</p>
               </td>
             </tr>
           </table>`
        : `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #E8F5E9; border-left: 4px solid #66BB6A; border-radius: 8px;">
             <tr>
               <td style="padding: 15px; background-color: #E8F5E9;">
                 <p style="margin: 0 0 8px 0; font-size: 15px; color: #5A3E2B; font-weight: 600;">💳 Payment Method: Online Payment</p>
                 <p style="margin: 0 0 8px 0; font-size: 14px; color: #2E7D32;"><strong>Status:</strong> <span style="color: #388E3C;">✅ Successful</span></p>
                 ${order.transactionId ? `<p style="margin: 0; font-size: 14px; color: #2E7D32;"><strong>Transaction ID:</strong> ${order.transactionId}</p>` : ''}
               </td>
             </tr>
           </table>`;

    // Build address HTML - table-based with explicit backgrounds
    const addressHtml = `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F2E6D8; border-radius: 8px;">
        <tr>
          <td style="padding: 15px; background-color: #F2E6D8;">
            <h3 style="margin: 0 0 12px 0; color: #5A3E2B; font-size: 16px; font-weight: 600;">📍 Shipping Address</h3>
            <p style="margin: 0; line-height: 1.6; color: #6B5B4F; font-size: 14px;">
              <strong style="color: #5A3E2B;">${order.customerName}</strong><br/>
              ${order.customerPhone}<br/>
              ${order.addressLine1}<br/>
              ${order.addressLine2 ? `${order.addressLine2}<br/>` : ''}
              ${order.city}, ${order.state} - ${order.pincode}
            </p>
          </td>
        </tr>
      </table>
    `;

    // Logo URL - Always use production domain for emails (localhost won't work in email clients)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chulbulijewels.in';
    const logoUrl = baseUrl.includes('localhost') 
      ? 'https://chulbulijewels.in/logo_desktop.png' 
      : `${baseUrl}/logo_desktop.png`;

    // Send email using Resend
    const result = await resend.emails.send({
      from: "Chulbuli Jewels <support@chulbulijewels.in>",
      to: order.customerEmail,
      subject: `✨ Order Confirmed - #${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">
          <!--[if mso]>
          <style type="text/css">
            table { border-collapse: collapse; }
          </style>
          <![endif]-->
          <style type="text/css">
            /* Force light mode for consistency */
            :root {
              color-scheme: light only;
              supported-color-schemes: light;
            }
            body, table, td {
              color-scheme: light !important;
            }
            /* Dark mode overrides - maintain readability */
            @media (prefers-color-scheme: dark) {
              .email-container { background-color: #ffffff !important; }
              .email-wrapper { background-color: #f5f5f5 !important; }
              .header-bg { background: linear-gradient(135deg, #D4A5A5 0%, #C89393 50%, #B87D7D 100%) !important; }
              .logo-bg { background-color: rgba(255, 255, 255, 0.95) !important; }
              .text-primary { color: #5A3E2B !important; }
              .text-secondary { color: #6B5B4F !important; }
              .bg-light { background-color: #FDF7F4 !important; }
              .bg-beige { background-color: #F2E6D8 !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
          <!-- Wrapper table for email clients -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-wrapper" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center" style="padding: 0;">
                <!-- Main container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                  
                  <!-- Header with Logo and Brand Colors -->
                  <tr>
                    <td class="header-bg" style="background: linear-gradient(135deg, #D4A5A5 0%, #C89393 50%, #B87D7D 100%); padding: 40px 20px; text-align: center;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td align="center">
                            <!-- Logo with white background for visibility -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px;">
                              <tr>
                                <td class="logo-bg" style="background-color: rgba(255, 255, 255, 0.95); padding: 15px 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                  <img src="${logoUrl}" alt="Chulbuli Jewels" style="display: block; width: 200px; max-width: 220px; height: auto;" />
                                </td>
                              </tr>
                            </table>
                            <div style="font-size: 20px; color: #ffffff; font-weight: 400; letter-spacing: 1.5px; text-shadow: 0 1px 3px rgba(0,0,0,0.15);">Thank you for your order!</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="background-color: #ffffff; padding: 30px 20px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <!-- Greeting -->
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <h2 class="text-primary" style="margin: 0 0 10px 0; color: #5A3E2B; font-size: 24px; font-weight: 500; font-family: Georgia, serif;">Hi ${order.customerName},</h2>
                            <p class="text-secondary" style="margin: 0; color: #6B5B4F; font-size: 15px; line-height: 1.6;">
                              Your order has been placed successfully! We're excited to get your beautiful jewelry pieces ready for you. 💖
                            </p>
                          </td>
                        </tr>
                        
                        <!-- Order Number Badge -->
                        <tr>
                          <td style="padding: 20px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="bg-light" style="background-color: #FDF7F4; border: 2px dashed #D4A5A5; border-radius: 8px;">
                              <tr>
                                <td style="padding: 20px; text-align: center; background-color: #FDF7F4;">
                                  <div style="color: #8B7355; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order Number</div>
                                  <div style="color: #B87D7D; font-size: 32px; font-weight: bold; font-family: Georgia, serif;">#${order.orderNumber}</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Order Details -->
                        <tr>
                          <td style="padding: 30px 0 15px;">
                            <h3 class="text-primary" style="margin: 0; color: #5A3E2B; font-size: 18px; font-weight: 600;">📦 Order Details</h3>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <!-- Responsive table for mobile -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 2px solid #E8D5C2; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                              <thead>
                                <tr class="bg-beige" style="background-color: #F2E6D8;">
                                  <th class="text-primary" style="padding: 12px 10px; text-align: left; font-weight: 600; color: #5A3E2B; font-size: 13px; border-bottom: 2px solid #E8D5C2; background-color: #F2E6D8;">Product</th>
                                  <th class="text-primary" style="padding: 12px 10px; text-align: center; font-weight: 600; color: #5A3E2B; font-size: 13px; border-bottom: 2px solid #E8D5C2; width: 60px; background-color: #F2E6D8;">Qty</th>
                                  <th class="text-primary" style="padding: 12px 10px; text-align: right; font-weight: 600; color: #5A3E2B; font-size: 13px; border-bottom: 2px solid #E8D5C2; width: 80px; background-color: #F2E6D8;">Price</th>
                                </tr>
                              </thead>
                              <tbody style="background-color: #ffffff;">
                                ${itemsHtml}
                              </tbody>
                              <tfoot>
                                <tr class="bg-light" style="background-color: #FDF7F4;">
                                  <td colspan="2" class="text-primary" style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 15px; color: #5A3E2B; border-top: 2px solid #E8D5C2; background-color: #FDF7F4;">Total:</td>
                                  <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 18px; color: #B87D7D; border-top: 2px solid #E8D5C2; background-color: #FDF7F4;">₹${typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : order.totalPrice}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Payment Details -->
                        <tr>
                          <td style="padding: 20px 0;">
                            ${paymentDetails}
                          </td>
                        </tr>
                        
                        <!-- Shipping Address -->
                        <tr>
                          <td style="padding: 10px 0;">
                            ${addressHtml}
                          </td>
                        </tr>
                        
                        <!-- Next Steps -->
                        <tr>
                          <td style="padding: 20px 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #E8F4F8; border-left: 4px solid #5DADE2; border-radius: 8px;">
                              <tr>
                                <td style="padding: 15px; background-color: #E8F4F8;">
                                  <h3 style="margin: 0 0 10px 0; color: #2874A6; font-size: 16px; font-weight: 600;">📬 What's Next?</h3>
                                  <p style="margin: 0; color: #1B4F72; font-size: 14px; line-height: 1.6;">
                                    We will start processing your order shortly. You'll receive another email once your order is shipped with tracking details. 🚚
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <!-- Footer Message -->
                        <tr>
                          <td style="padding: 30px 0 0; border-top: 1px solid #E8D5C2;">
                            <p class="text-secondary" style="margin: 0 0 10px 0; color: #6B5B4F; font-size: 14px; text-align: center;">
                              Need help? Contact us at <a href="mailto:support@chulbulijewels.in" style="color: #B87D7D; text-decoration: none; font-weight: 600;">support@chulbulijewels.in</a>
                            </p>
                            <p style="margin: 0; color: #8B7355; font-size: 13px; text-align: center; font-style: italic;">
                              With love,<br/>
                              <strong style="color: #B87D7D;">Team Chulbuli Jewels</strong> 💎
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td class="bg-beige" style="background-color: #F2E6D8; padding: 20px; text-align: center; border-top: 1px solid #E8D5C2;">
                      <p style="margin: 0 0 8px 0; color: #8B7355; font-size: 12px;">
                        © ${new Date().getFullYear()} Chulbuli Jewels. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px;">
                        <a href="https://chulbulijewels.in" style="color: #B87D7D; text-decoration: none; font-weight: 600;">Visit our website</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("✅ Order confirmation email sent successfully:", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      email: order.customerEmail,
      emailId: result.data?.id,
    });

    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error("❌ Email sending failed:", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      error: error instanceof Error ? error.message : error,
    });
    
    // Don't throw error - email failure shouldn't break order creation
    return { success: false, error };
  }
}
