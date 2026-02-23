const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface EmailPayload {
  orderId: string;
  city: string;
  fullName: string;
  quantity: number;
  total: number;
  email: string;
  phone: string;
  section: string;
  row: string;
  expiresAt: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: EmailPayload = await req.json();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:24px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:600;letter-spacing:0.5px;">BTS VERIFIED</h1>
          </td>
        </tr>

        <!-- Order ID Banner -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;">Order ID</p>
            <p style="margin:0;font-size:22px;font-weight:700;font-family:'Courier New',monospace;color:#111;">${payload.orderId}</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0;font-size:15px;color:#333;line-height:1.6;">
              Hi ${payload.fullName},<br><br>
              Your ticket reservation has been received and your seats are on hold. Please complete payment within <strong>30 minutes</strong> to finalize the transfer.
            </p>
          </td>
        </tr>

        <!-- Reservation Summary -->
        <tr>
          <td style="padding:24px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e5e5e5;border-radius:6px;">
              <tr>
                <td style="padding:16px 20px 8px;">
                  <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;">Reservation Summary</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 20px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#666;">City</td>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;font-weight:500;text-align:right;">${payload.city}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#666;">Section</td>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;font-weight:500;text-align:right;">${payload.section}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#666;">Row</td>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;font-weight:500;text-align:right;">${payload.row}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;color:#666;">Quantity</td>
                      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#111;font-weight:500;text-align:right;">${payload.quantity}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;font-size:13px;color:#666;font-weight:600;">Total</td>
                      <td style="padding:10px 0;font-size:18px;color:#111;font-weight:700;text-align:right;">$${payload.total.toLocaleString()}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr><td style="padding:0 0 12px;"></td></tr>
            </table>
          </td>
        </tr>

        <!-- Payment Instructions -->
        <tr>
          <td style="padding:0 32px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #f59e0b;border-radius:6px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;">⚠️ Payment Required Within 30 Minutes</p>
                  <p style="margin:0 0 12px;font-size:14px;color:#78350f;line-height:1.5;">
                    To secure your tickets, send <strong>$${payload.total.toLocaleString()}</strong> using one of the methods below:
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:4px 0;font-size:14px;color:#78350f;">💳 <strong>Zelle</strong> — Send to the address provided by your agent</td>
                    </tr>
                    <tr>
                      <td style="padding:4px 0;font-size:14px;color:#78350f;">📱 <strong>CashApp</strong> — Send to the tag provided by your agent</td>
                    </tr>
                  </table>
                  <p style="margin:12px 0 0;font-size:13px;color:#92400e;">
                    Include your Order ID <strong>${payload.orderId}</strong> in the payment note.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Trust Footer -->
        <tr>
          <td style="padding:0 32px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e5e5;">
              <tr>
                <td style="padding:20px 0 0;">
                  <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.5px;">🔒 Secure Ticketmaster Transfer</p>
                  <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                    Once payment is confirmed, your tickets will be transferred directly to your Ticketmaster account. 
                    All transfers are verified and tracked through our secure process. You will receive a separate 
                    confirmation once the transfer is complete.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa;padding:16px 32px;border-top:1px solid #e5e5e5;">
            <p style="margin:0;font-size:11px;color:#aaa;text-align:center;">
              BTS Verified · Secure Ticket Reservations<br>
              This is an automated message. Please do not reply directly to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'BTS Verified <reservations@brigit.work>',
        to: [payload.email],
        subject: `${payload.city} Ticket Reservation – ACTION REQUIRED (Order ID: ${payload.orderId})`,
        html: htmlBody,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', result);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: result }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Confirmation email sent to', payload.email);
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Confirmation email error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
