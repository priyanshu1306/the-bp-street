import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const email = session.user.email;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Delete all related data in order
        // 1. Delete cart items first
        const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            await prisma.cart.delete({
                where: { userId: user.id },
            });
        }

        // 2. Delete order items and orders
        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            select: { id: true },
        });

        for (const order of orders) {
            await prisma.orderItem.deleteMany({
                where: { orderId: order.id },
            });
        }

        await prisma.order.deleteMany({
            where: { userId: user.id },
        });

        // 3. Delete any remaining email OTPs
        await prisma.emailOTP.deleteMany({
            where: { email },
        });

        // 4. Finally delete the user
        await prisma.user.delete({
            where: { id: user.id },
        });

        return NextResponse.json({
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { error: "Failed to delete account" },
            { status: 500 }
        );
    }
}
