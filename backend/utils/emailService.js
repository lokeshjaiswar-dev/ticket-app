const sendEmail = async (toEmail, toName, subject, htmlContent) => {
  try {
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
        htmlContent: htmlContent
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Brevo Email Error: ", error.message);
  }
};

module.exports = { sendEmail };