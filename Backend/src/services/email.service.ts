import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, link: string) {
  try {
    console.log("EMAIL FUNCTION START");

    const response = await resend.emails.send({
      from: "Sensei <onboarding@resend.dev>",
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

    console.log("Email sent:", response);

  } catch (error) {
    console.error("Email sending failed:", error);
  }

  console.log("EMAIL FUNCTION END");
}