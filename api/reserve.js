await resend.emails.send({
  from: 'Brigit Access Desk <reservations@brigit.work>',
  to: email,
  // Neutral subject avoids AI phishing triggers
  subject: `Status Update: Reference ID ${orderId}`, 
  // Adding a plain text version is REQUIRED to pass spam filters
  text: `System Notification: Your reservation for BTS ${city} has been initialized. Reference ID: ${orderId}. Please complete verification at Brigit.work within 30 minutes.`,
  html: `
    <div style="font-family: sans-serif; color: #333; max-width: 600px;">
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
