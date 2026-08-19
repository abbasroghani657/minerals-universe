import nodemailer from 'nodemailer';

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  currencySymbol?: string;
  currency?: string;
  paymentMethod: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmationEmail(order: OrderDetails): Promise<void> {
  const sym = order.currencySymbol || 'PKR ';

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#333;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#333;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;color:#333;text-align:right;">${sym}${item.price.toLocaleString()}</td>
      </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:#0f5c53;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:600;letter-spacing:0.5px;">Minerals Universe</h1>
            <p style="margin:6px 0 0;color:#d4ede6;font-size:14px;">Official Order Confirmation & Invoice</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:16px;color:#333;">Hi <strong>${order.customerName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">Thank you for your purchase from <strong>Minerals Universe</strong>. We've received your order and it is now being processed.</p>

            <div style="background:#f0faf9;border-left:4px solid #0f5c53;padding:14px 18px;border-radius:4px;margin-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#0f5c53;font-weight:600;">Order ID: <span style="font-size:18px;">#${order.orderId}</span></p>
              <p style="margin:4px 0 0;font-size:13px;color:#666;">Payment via: <strong>${order.paymentMethod}</strong></p>
            </div>

            <!-- Items Table -->
            <h3 style="margin:0 0 12px;font-size:16px;color:#222;">Order Summary</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#f9f9f9;">
                  <th style="padding:10px 12px;text-align:left;font-size:13px;color:#888;font-weight:600;">Item</th>
                  <th style="padding:10px 12px;text-align:center;font-size:13px;color:#888;font-weight:600;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#888;font-weight:600;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
                <tr style="background:#f0faf9;">
                  <td colspan="2" style="padding:12px;font-weight:700;font-size:15px;color:#0f5c53;">Total Amount</td>
                  <td style="padding:12px;font-weight:700;font-size:16px;color:#0f5c53;text-align:right;">${sym}${order.total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <!-- Shipping -->
            <div style="margin:28px 0;padding:18px;background:#fafafa;border-radius:8px;border:1px solid #f0f0f0;">
              <p style="margin:0 0 6px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Shipping To</p>
              <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${order.shippingAddress}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#555;">📞 ${order.customerPhone}</p>
            </div>

            <!-- What happens next -->
            <h3 style="margin:0 0 10px;font-size:16px;color:#222;">What happens next?</h3>
            <p style="margin:0 0 8px;font-size:14px;color:#555;line-height:1.6;">✅ &nbsp;Your order will be verified and prepared for dispatch within <strong>1–2 business days</strong>.</p>
            <p style="margin:0 0 8px;font-size:14px;color:#555;line-height:1.6;">📦 &nbsp;You will receive full tracking details once your certified parcel is shipped.</p>
            <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">💬 &nbsp;For urgent questions, reply to this email or reach us on WhatsApp.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #f0f0f0;">
            <p style="margin:0 0 6px;font-size:13px;color:#888;"><strong>Minerals Universe</strong> — Pakistan's Premier Gemstone Destination</p>
            <p style="margin:0;font-size:12px;color:#aaa;">Questions? Email us at <a href="mailto:${process.env.ADMIN_EMAIL || 'support@mineralsuniverse.com'}" style="color:#0f5c53;">${process.env.ADMIN_EMAIL || 'support@mineralsuniverse.com'}</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Minerals Universe" <${process.env.SMTP_USER || 'no-reply@mineralsuniverse.com'}>`,
    to: order.customerEmail,
    bcc: process.env.ADMIN_EMAIL,
    subject: `Order Confirmed — #${order.orderId}`,
    html,
  });
}
