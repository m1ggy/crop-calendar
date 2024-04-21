import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

class Emailer {
  transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASS,
      },
    });
  }

  async sendEmail(options: Mail.Options) {
    await this.verifyConfiguration();
    return this.transporter.sendMail(options);
  }

  verifyConfiguration() {
    if (!this.transporter) throw new Error("Transporter not initialized");
    return this.transporter.verify();
  }
}

export default Emailer;
