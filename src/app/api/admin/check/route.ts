import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/check - Check if current user is admin
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ isAdmin: false });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        return NextResponse.json({
            isAdmin: user?.role === "admin"
        });
    } catch (error) {
        console.error("Admin check error:", error);
        return NextResponse.json({ isAdmin: false });
    }
}
