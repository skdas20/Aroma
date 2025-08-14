const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Build a transporter from environment variables. If missing, return null and no-op send.
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('📭 Mailer disabled: missing SMTP env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)');
    return null;
  }
  const secure = String(SMTP_PORT) === '465';
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function renderTemplate(templatePath, replacements) {
  let html = fs.readFileSync(templatePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(pattern, value ?? '');
  }
  return html;
}

async function sendOrderConfirmation({ to, order, user }) {
  const transporter = createTransporter();
  if (!transporter) return; // no-op if not configured

  const fromName = process.env.MAIL_FROM_NAME || 'AMARAA LUXURY';
  const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;
  const from = `${fromName} <${fromEmail}>`;

  const templatePath = path.join(__dirname, '..', 'templates', 'orderConfirmation.html');

  const itemsHtml = (order.items || [])
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 0;">${it.name} ${it.size ? `(${it.size})` : ''}</td>
          <td style="padding:8px 0; text-align:center;">${it.quantity}</td>
          <td style="padding:8px 0; text-align:right;">₹${Number(it.price).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = renderTemplate(templatePath, {
    customerName: order.shippingAddress?.fullName || user?.displayName || 'Customer',
    orderNumber: order.orderNumber,
    orderDate: new Date(order.orderDate || Date.now()).toLocaleString(),
    items: itemsHtml,
    totalAmount: `₹${Number(order.totalAmount).toFixed(2)}`,
    address: [
      order.shippingAddress?.street || order.shippingAddress?.address,
      order.shippingAddress?.city,
      order.shippingAddress?.state,
      order.shippingAddress?.zipCode,
    ]
      .filter(Boolean)
      .join(', '),
    supportEmail: process.env.SUPPORT_EMAIL || fromEmail,
    brandName: fromName,
    brandUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    year: String(new Date().getFullYear()),
  });

  const mailOptions = {
    from,
    to,
    subject: `Your order ${order.orderNumber} is confirmed`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Order confirmation email sent to ${to} for ${order.orderNumber}`);
  } catch (err) {
    console.error(' Failed to send order confirmation email:', err.message);
  }
}

module.exports = { sendOrderConfirmation };
