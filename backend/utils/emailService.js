const sendEmail = async (toEmail, toName, subject, htmlContent, ticketId = null) => {
  try {
    // Local development me frontend port 5173 hai
    const trackingUrl = ticketId 
      ? `http://localhost:5173/track?id=${ticketId}` 
      : 'http://localhost:5173/track';

    // Email template ke footer me sundar sa button/link add kar dete hain
    const footerHtml = ticketId ? `
      <br/><hr style="border:0;border-top:1px solid #eee;margin:20px 0;"/>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${trackingUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Track Your Ticket Live
        </a>
        <p style="font-size: 11px; color: #64748b; margin-top: 10px;">
          If the button doesn't work, copy this link: <br/>
          <a href="${trackingUrl}" style="color: #2563eb;">${trackingUrl}</a>
        </p>
      </div>
    ` : '';

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
        htmlContent: `${htmlContent} ${footerHtml}` // Footer ko dynamic content ke sath attach kiya
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Brevo Email Error: ", error.message);
  }
};

module.exports = { sendEmail };