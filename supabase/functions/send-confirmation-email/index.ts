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
  expiresAt: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: EmailPayload = await req.json();

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="font-size: 24px; color: #111; margin-bottom: 8px;">🎟️ Reservation Confirmed</h1>
        <p style="color: #555; font-size: 14px; margin-bottom: 24px;">Your seats are held for 15 minutes. Complete payment to finalize your Ticketmaster transfer.</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Order ID</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; font-family: monospace; font-size: 15px;">${payload.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">City</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${payload.city}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${payload.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Quantity</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${payload.quantity}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Total</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; font-size: 15px;">$${payload.total.toLocaleString()}</td>
          </tr>
        </table>

        <div style="background: #f8f8f8; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #666;">
            ⏳ <strong>Hold expires at:</strong> ${new Date(payload.expiresAt).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' })} ET
          </p>
        </div>

        <p style="font-size: 12px; color: #999; margin-top: 32px;">
          If you did not make this reservation, please disregard this email.
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'BTS Verified <onboarding@resend.dev>',
        to: [payload.email],
        subject: `Reservation Confirmed — ${payload.orderId}`,
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

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
