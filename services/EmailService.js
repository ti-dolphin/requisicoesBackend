const nodemailer = require("nodemailer");

class EmailService {
  static transporter = nodemailer.createTransport({
    host: "email-ssl.com.br",
    port: 465,
    auth: {
      user: "comunicacao@dse.com.br",
      pass: "Comunicacao1707@dse",
    },
  });

  static async sendEmail(recipientEmail, subject, text, html, ccEmails) {
    try {
      const mailOptions = {
        from: `'Comunicação - Dolphin Soluções em Engenharia' <comunicacao@dse.com.br>`,
        to: recipientEmail,
        subject: subject,
        text: text,
        html: html,
        ccEmails: ccEmails
      };
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

module.exports = EmailService;


