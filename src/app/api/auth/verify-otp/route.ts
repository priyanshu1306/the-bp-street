import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Find the OTP record
        const otpRecord = await prisma.emailOTP.findFirst({
            where: {
                email,
                otp,
                verified: false,
                expiresAt: {
                    gt: new Date(),
                },
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
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
                    name: email.split("@")[0], // Use email prefix as name
                },
            });

            // Create empty cart for new user
            await prisma.cart.create({
                data: { userId: user.id },
            });
        }

        // Clean up old OTPs
        await prisma.emailOTP.deleteMany({
            where: { email },
        });

        // Check if user is new (name is just email prefix)
        const isNewUser = user.name === email.split("@")[0];

        return NextResponse.json({
            message: "OTP verified successfully",
            isNewUser,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
