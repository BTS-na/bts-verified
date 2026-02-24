import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, email, phone, quantity, city, orderId, total } = req.body;

  try {
    // 1. Send Telegram Notification
    const telegramUrl = `https://api.telegram.org{process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramMsg = `🚨 **New Ticket Reservation**\nID: ${orderId}\nCity: ${city}\nName: ${fullName}\nQty: ${quantity}\nTotal: $${total}\nContact: ${email}`;

    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMsg,
        parse_mode: 'Markdown',
      }),
    });

    // 2. Send Confirmation Email via Resend
    await resend.emails.send({
      from: 'reservations@brigit.work',
      to: email,
      subject: `Action Required: BTS ${city} Reservation`,
      html: `<strong>Order ID: ${orderId}</strong><p>Your seats are held for 30 minutes. Complete payment to secure transfer.</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
