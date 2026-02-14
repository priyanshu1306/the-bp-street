import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { email, name } = await request.json();

        if (!email || !name) {
            return NextResponse.json(
                { error: "Email and name are required" },
                { status: 400 }
            );
        }

        // Update user's name
        const user = await prisma.user.update({
            where: { email },
            data: { name: name.trim() },
        });

        return NextResponse.json({
            message: "Name updated successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Update name error:", error);
        return NextResponse.json(
            { error: "Failed to update name" },
            { status: 500 }
        );
    }
}
