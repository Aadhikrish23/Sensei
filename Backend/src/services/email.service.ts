import axios from "axios";

export async function sendVerificationEmail(email: string, link: string) {
  try {
    const response = await axios.post(
      "https://send.api.mailtrap.io/api/send",
      {
        from: {
          email: "sensei@mailtrap.dev",
          name: "Sensei"
        },
        to: [{ email }],
        subject: "Verify your Sensei account",
        html: `
          <h2>Welcome to Sensei</h2>
          <p>Please verify your email.</p>
          <a href="${link}">Verify Email</a>
        `
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAILTRAP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Email sent:", response.data);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}