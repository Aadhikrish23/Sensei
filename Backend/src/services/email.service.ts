import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

export async function sendVerificationEmail(email: string, link: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Sensei" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify your Sensei account",
      html: `
        <h2>Welcome to Sensei</h2>
        <p>Please verify your email to activate your account.</p>
        <a href="${link}"
           style="padding:10px 16px;background:#6366f1;color:white;text-decoration:none;border-radius:6px;">
           Verify Email
        </a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}