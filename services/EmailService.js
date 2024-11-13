const nodemailer = require("nodemailer");

class EmailService {
  static transporter = nodemailer.createTransport({
    host: "email-ssl.com.br",
    port: 465,
    auth: {
      user: "ti@dse.com.br",
      pass: "Dse17@07",
    },
  });

  static async sendEmail(recipientEmail, subject, text, ccEmails) {
    try {
      const mailOptions = {
        from: "ti@dse.com.br",
        to: recipientEmail,
        subject: subject,
        text: text,
        ccEmails: ccEmails
      };
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

module.exports = EmailService;


