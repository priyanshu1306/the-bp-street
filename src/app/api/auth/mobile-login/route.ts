import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// POST /api/auth/mobile-login - Mobile app login via OTP
export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Verify OTP
        const otpRecord = await prisma.emailOTP.findFirst({
            where: {
                email,
                otp,
                verified: false,
                expiresAt: { gt: new Date() },
            },
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await prisma.emailOTP.update({
            where: { id: otpRecord.id },
            data: { verified: true },
        });

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found. Please register first." },
                { status: 404 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            process.env.NEXTAUTH_SECRET!,
            { expiresIn: "30d" }
        );

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error: any) {
        console.error("Mobile login error:", error);
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}
