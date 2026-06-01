const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendMail(oldCount, newCount, meta = {}) {
  const isInitial = Boolean(meta?.initial);
  const delta = typeof oldCount === 'number' ? newCount - oldCount : null;

  const subject = isInitial
    ? "Approved Documents Count Alert (Initial Report)"
    : "Approved Documents Count Alert";

  const text = isInitial
    ? `Approved documents current count: ${newCount}`
    : `Approved documents count changed: ${oldCount} -> ${newCount}${delta !== null ? ` (Δ ${delta})` : ''}`;

  const html = `
   <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Approved Documents Count Alert</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Segoe UI,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
      <tr>
        <td align="center">

          <table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="
                background:linear-gradient(135deg,#0f172a,#2563eb);
                padding:30px;
                color:#ffffff;
              ">
                <h1 style="margin:0;font-size:28px;">
                  Vidhyux Technologies
                </h1>
                <p style="margin:8px 0 0;color:#dbeafe;font-size:14px;">
                  Automated Monitoring & Notification Service
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:35px;">

                <div style="
                  display:inline-block;
                  background:#ecfdf5;
                  color:#047857;
                  padding:8px 16px;
                  border-radius:999px;
                  font-weight:600;
                  font-size:13px;
                  margin-bottom:20px;
                ">
                  ✓ Approved Documents ${isInitial ? 'Report' : 'Status Update'}
                </div>

                <h2 style="margin:0 0 15px;color:#111827;">
                  Approved Documents Count ${isInitial ? 'Current Snapshot' : 'Updated Count'}
                </h2>

                <p style="color:#4b5563;line-height:1.7;font-size:15px;">
                  ${isInitial ? 'Initial monitoring run completed.' : 'Monitoring detected a change. Latest count is shown below.'}
                </p>

                <!-- Metric Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="
                  margin:25px 0;
                  border:1px solid #e5e7eb;
                  border-radius:12px;
                  background:#f8fafc;
                ">
                  <tr>
                    <td align="center" style="padding:30px;">
                      <div style="
                        font-size:13px;
                        color:#6b7280;
                        text-transform:uppercase;
                        letter-spacing:1px;
                      ">
                        Current Document Count
                      </div>

                      <div style="
                        font-size:48px;
                        font-weight:700;
                        color:#2563eb;
                        margin-top:10px;
                      ">
                        ${newCount}
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Details -->
                <table width="100%" cellpadding="8" cellspacing="0" style="
                  border-collapse:collapse;
                  margin-top:20px;
                ">
                  <tr>
                    <td style="color:#6b7280;font-weight:600;width:180px;">
                      Event Type
                    </td>
                    <td style="color:#111827;">
                      ${isInitial ? 'Initial Report' : (delta === 0 ? 'No Change Detected' : 'Scheduled Run')}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;font-weight:600;">
                      Timestamp
                    </td>
                    <td style="color:#111827;">
                      ${new Date().toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;font-weight:600;">
                      Source
                    </td>
                    <td style="color:#111827;">
                      Vidhyux Monitoring Service
                    </td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;font-weight:600;">
                      Previous Count
                    </td>
                    <td style="color:#111827;">
                      ${isInitial ? 'N/A' : oldCount}
                    </td>
                  </tr>

                  <tr>
                    <td style="color:#6b7280;font-weight:600;">
                      Environment
                    </td>
                    <td style="color:#111827;">
                      ${process.env.NODE_ENV || "Production"}
                    </td>
                  </tr>

                  ${!isInitial ? `
                  <tr>
                    <td style="color:#6b7280;font-weight:600;">
                      Change
                    </td>
                    <td style="color:#111827;">
                      ${delta} 
                    </td>
                  </tr>
                  ` : ''}
                </table>

                <div style="
                  margin-top:30px;
                  padding:16px;
                  background:#eff6ff;
                  border-left:4px solid #2563eb;
                  border-radius:6px;
                ">
                  <p style="margin:0;color:#1e3a8a;font-size:14px;">
                    This is an automated notification generated by the scheduled monitoring job.
                  </p>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                background:#f8fafc;
                padding:24px;
                text-align:center;
                border-top:1px solid #e5e7eb;
              ">
                <p style="margin:0;color:#6b7280;font-size:13px;">
                  © ${new Date().getFullYear()} Vidhyux Technologies
                </p>

                <p style="
                  margin:8px 0 0;
                  color:#9ca3af;
                  font-size:12px;
                ">
                  This is an automated notification. Please do not reply.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const info = await transporter.sendMail({
    from: `"Approved Documents Count Alert " <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject,
    text,
    html,
  });

  console.log("Email sent:", info.messageId);
}

module.exports = { sendMail };