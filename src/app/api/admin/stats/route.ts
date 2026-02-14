import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/stats - Get dashboard statistics
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

        // Get counts
        const [totalOrders, pendingOrders, totalProducts, totalUsers] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { status: "PENDING" } }),
            prisma.product.count(),
            prisma.user.count(),
        ]);

        // Get total revenue
        const revenueResult = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { not: "CANCELLED" } },
        });

        // Today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await prisma.order.count({
            where: { createdAt: { gte: today } },
        });

        // Recent orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        return NextResponse.json({
            stats: {
                totalOrders,
                pendingOrders,
                totalRevenue: revenueResult._sum.totalAmount || 0,
                totalProducts,
                totalUsers,
                todayOrders,
            },
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.user.name || order.user.email.split("@")[0],
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt.toISOString(),
            })),
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
