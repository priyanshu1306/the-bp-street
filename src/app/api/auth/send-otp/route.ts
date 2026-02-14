import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/email";

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        console.log("📧 Send OTP request for:", email);

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Generate 6-digit OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log("🔢 Generated OTP:", otp);

        // Delete any existing OTPs for this email
        try {
            await prisma.emailOTP.deleteMany({
                where: { email },
            });
            console.log("🗑️ Deleted old OTPs");
        } catch (dbError) {
            console.error("❌ DB delete error:", dbError);
        }

        // Store new OTP
        try {
            await prisma.emailOTP.create({
                data: {
                    email,
                    otp,
                    expiresAt,
                },
            });
            console.log("💾 Saved OTP to database");
        } catch (dbError: any) {
            console.error("❌ DB create error:", dbError);
            return NextResponse.json(
                { error: `Database error: ${dbError.message}` },
                { status: 500 }
            );
        }

        // Send OTP email
        console.log("📤 Sending email via Resend...");
        const result = await sendOTPEmail(email, otp);
        console.log("📬 Resend result:", JSON.stringify(result));

        if (!result.success) {
            console.error("❌ Email send failed:", result.error);
            const errorMsg = result.error?.message || JSON.stringify(result.error);
            return NextResponse.json(
                { error: `Email failed: ${errorMsg}` },
                { status: 500 }
            );
        }

        console.log("✅ OTP sent successfully!");

        return NextResponse.json({
            message: "OTP sent successfully",
            email,
        });
    } catch (error: any) {
        console.error("❌ Send OTP error:", error);
        return NextResponse.json(
            { error: `Error: ${error.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
