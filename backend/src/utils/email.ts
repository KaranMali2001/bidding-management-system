/* Simple email utility – swap with real provider */

import { transport } from '@/config/nodemailer';

export async function sendEmail(payload: any) {
  if (!process.env.SMTP_USER) {
    console.log('Email payload (dev):', payload);
    return;
  }
  await transport.sendMail({
    from: process.env.SMTP_FROM || 'noreply@example.com',
    to: payload?.email || process.env.SMTP_FROM,
    subject: 'Notification',
    text: JSON.stringify(payload, null, 2),
  });
}
