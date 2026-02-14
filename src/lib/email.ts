import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  try {
    const mailOptions = {
      from: `"The BP Street" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your OTP: ${otp} - The BP Street`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%); border-radius: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FF6B35; margin: 0; font-size: 28px;">🍽️ The BP Street</h1>
            <p style="color: #666; margin-top: 5px;">Authentic Street Food</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 20px;">Your Login OTP</h2>
            <p style="color: #666; margin: 0 0 25px 0; line-height: 1.6;">
              Enter this code to sign in to your account. It expires in <strong>10 minutes</strong>.
            </p>
            
            <div style="background: linear-gradient(135deg, #FF6B35 0%, #ff8555 100%); padding: 20px 30px; border-radius: 12px; text-align: center;">
              <span style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px;">${otp}</span>
            </div>
            
            <p style="color: #999; font-size: 13px; margin-top: 25px; text-align: center;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 25px;">
            © 2024 The BP Street. Made with ❤️ in Noida
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    return { success: true, data: info };
  } catch (error: any) {
    console.error("❌ Email send error:", error);
    return { success: false, error };
  }
}
