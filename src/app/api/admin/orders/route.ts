import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/orders - Get all orders
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify admin
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true },
        });

        if (user?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                items: true,
            },
        });

        return NextResponse.json({
            orders: orders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.user.name || order.user.email.split("@")[0],
                customerEmail: order.user.email,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentMethod: order.paymentMethod,
                deliveryAddress: order.deliveryAddress,
                deliveryPhone: order.deliveryPhone,
                notes: order.notes,
                createdAt: order.createdAt.toISOString(),
                items: order.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            })),
        });
    } catch (error) {
        console.error("Admin orders error:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
