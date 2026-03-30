import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

const FROM = `"${process.env.SMTP_FROM_NAME || "Serenity Wellness Spa"}" <${process.env.SMTP_EMAIL}>`;

// ─── OTP Email ────────────────────────────────────────────────────────────────
export async function sendOTPEmail(to: string, name: string, otp: string): Promise<void> {
  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: "Verify Your Email — Serenity Wellness Spa",
    html: otpTemplate(name, otp),
  });
}

// ─── Booking Confirmation ─────────────────────────────────────────────────────
export async function sendBookingConfirmationEmail(
  to: string,
  name: string,
  details: {
    bookingId: string;
    service: string;
    therapist: string;
    date: string;
    time: string;
    duration: number;
    price: number;
  }
): Promise<void> {
  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: `Booking Confirmed — ${details.service} on ${details.date}`,
    html: bookingConfirmationTemplate(name, details),
  });
}

// ─── Password Reset ───────────────────────────────────────────────────────────
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetLink: string
): Promise<void> {
  await getTransporter().sendMail({
    from: FROM,
    to,
    subject: "Reset Your Password — Serenity Wellness Spa",
    html: passwordResetTemplate(name, resetLink),
  });
}

// ─── Templates ────────────────────────────────────────────────────────────────

const baseStyle = `
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #F8FBF9;
  margin: 0; padding: 0;
`;
const cardStyle = `
  max-width: 520px; margin: 32px auto; background: #fff;
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(168,203,183,0.2);
  border: 1px solid #A8CBB7;
`;
const headerStyle = `
  background: linear-gradient(135deg, #A8CBB7, #6D8B74);
  padding: 32px 40px; text-align: center;
`;
const bodyStyle = `padding: 36px 40px;`;
const footerStyle = `
  padding: 20px 40px; background: #F8FBF9; text-align: center;
  font-size: 12px; color: #6D8B74; border-top: 1px solid #A8CBB7;
`;

function otpTemplate(name: string, otp: string): string {
  return `
<!DOCTYPE html><html><body style="${baseStyle}">
<div style="${cardStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#fff;font-size:24px;margin:0;font-weight:300;letter-spacing:1px">
      🌿 Serenity Wellness Spa
    </h1>
  </div>
  <div style="${bodyStyle}">
    <h2 style="color:#1F2A2E;font-size:20px;margin:0 0 12px">Verify Your Email</h2>
    <p style="color:#5a6e73;font-size:15px;line-height:1.6;margin:0 0 28px">
      Hi ${name}, use the code below to verify your email address.
      This code expires in <strong>5 minutes</strong>.
    </p>
    <div style="background:#F8FBF9;border:2px dashed #A8CBB7;border-radius:16px;
                padding:28px;text-align:center;margin:0 0 24px">
      <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#6D8B74">
        ${otp}
      </span>
    </div>
    <p style="color:#5a6e73;font-size:13px;margin:0">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>
  <div style="${footerStyle}">
    © 2026 Serenity Wellness Spa · Melbourne, VIC
  </div>
</div>
</body></html>`;
}

function bookingConfirmationTemplate(
  name: string,
  d: { bookingId: string; service: string; therapist: string; date: string; time: string; duration: number; price: number }
): string {
  return `
<!DOCTYPE html><html><body style="${baseStyle}">
<div style="${cardStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#fff;font-size:24px;margin:0;font-weight:300;letter-spacing:1px">
      🌿 Booking Confirmed
    </h1>
  </div>
  <div style="${bodyStyle}">
    <h2 style="color:#1F2A2E;font-size:20px;margin:0 0 8px">You're all set, ${name}!</h2>
    <p style="color:#5a6e73;font-size:14px;margin:0 0 24px">
      Your wellness session has been confirmed. We look forward to seeing you.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 24px">
      ${[
        ["Booking ID", d.bookingId],
        ["Service", d.service],
        ["Therapist", d.therapist],
        ["Date", d.date],
        ["Time", d.time],
        ["Duration", `${d.duration} minutes`],
        ["Price", `$${d.price} AUD`],
      ].map(([k, v]) => `
        <tr>
          <td style="padding:10px 0;color:#6D8B74;font-size:13px;font-weight:600;
                     border-bottom:1px solid #f0f7f3;width:40%">${k}</td>
          <td style="padding:10px 0;color:#1F2A2E;font-size:14px;
                     border-bottom:1px solid #f0f7f3">${v}</td>
        </tr>`).join("")}
    </table>
    <div style="background:#f0f7f3;border-radius:12px;padding:16px;font-size:13px;color:#5a6e73">
      📍 123 Wellness Lane, South Yarra, Melbourne VIC 3141<br>
      📞 +61 3 9000 1234
    </div>
  </div>
  <div style="${footerStyle}">
    Need to reschedule? Contact us at hello@serenityspa.com.au<br>
    © 2026 Serenity Wellness Spa · Melbourne, VIC
  </div>
</div>
</body></html>`;
}

function passwordResetTemplate(name: string, resetLink: string): string {
  return `
<!DOCTYPE html><html><body style="${baseStyle}">
<div style="${cardStyle}">
  <div style="${headerStyle}">
    <h1 style="color:#fff;font-size:24px;margin:0;font-weight:300;letter-spacing:1px">
      🌿 Serenity Wellness Spa
    </h1>
  </div>
  <div style="${bodyStyle}">
    <h2 style="color:#1F2A2E;font-size:20px;margin:0 0 12px">Reset Your Password</h2>
    <p style="color:#5a6e73;font-size:15px;line-height:1.6;margin:0 0 28px">
      Hi ${name}, click the button below to reset your password.
      This link expires in <strong>1 hour</strong>.
    </p>
    <a href="${resetLink}" style="display:block;text-align:center;background:#6D8B74;
       color:#fff;padding:16px 32px;border-radius:12px;text-decoration:none;
       font-size:15px;font-weight:600;margin:0 0 24px">
      Reset Password
    </a>
    <p style="color:#5a6e73;font-size:13px;margin:0">
      If you didn't request a password reset, ignore this email. Your password won't change.
    </p>
  </div>
  <div style="${footerStyle}">
    © 2026 Serenity Wellness Spa · Melbourne, VIC
  </div>
</div>
</body></html>`;
}
