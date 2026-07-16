const sendEmail = async (toEmail, toName, subject, htmlContent, ticketId = null) => {
  try {
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const trackingUrl = ticketId 
      ? `${frontendBaseUrl}/track?id=${ticketId}` 
      : `${frontendBaseUrl}/track`;

    const footerHtml = ticketId ? `
      <br/>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <div style="text-align: left;">
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          You can track the live progress, add updates, or view responses for this ticket on our support portal.
        </p>
        <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #0f172a; color: #ffffff; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 500; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          Track Ticket Status
        </a>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 20px; line-height: 1.6; border-left: 2px solid #e2e8f0; padding-left: 12px; font-family: monospace;">
          Button not working? Copy URL:<br/>
          <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="color: #0f172a; text-decoration: underline;">${trackingUrl}</a>
        </p>
      </div>
    ` : '';

    const fullHtmlTemplate = `
      <div style="background-color: #fafafa; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%; width: 100%; box-sizing: border-box;">
        <div style="max-w: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);">
          
          <div style="margin-bottom: 24px;">
            <p style="font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 4px 0;">
              Datastraw Support
            </p>
            <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin: 0;">
              ${subject}
            </h2>
          </div>

          <div style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
            ${htmlContent}
          </div>

          ${footerHtml}
          
          <div style="margin-top: 32px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              &copy; ${new Date().getFullYear()} Datastraw CRM. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "Datastraw CRM Support", email: process.env.SENDER_EMAIL },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: fullHtmlTemplate
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Brevo Email Error: ", error.message);
  }
};

module.exports = {
    sendEmail
}