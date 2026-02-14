import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Generate unique order number
function generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BP${timestamp}${random}`;
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Please login to view orders" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Transform orders for frontend
        const formattedOrders = orders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt.toISOString(),
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
        }));

        return NextResponse.json({ orders: formattedOrders });
    } catch (error) {
        console.error("Get orders error:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Please login to place order" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            items,
            deliveryType,
            paymentMethod,
            address,
            phone,
            specialInstructions,
            subtotal,
            tax,
            deliveryFee,
            totalAmount,
        } = body;

        // Validate required fields
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        if (!phone) {
            return NextResponse.json(
                { error: "Phone number is required" },
                { status: 400 }
            );
        }

        if (deliveryType === "delivery" && !address) {
            return NextResponse.json(
                { error: "Delivery address is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Format address string
        const deliveryAddress = address
            ? `${address.flat}, ${address.street}, ${address.city} - ${address.pincode}`
            : "Pickup from store";

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: user.id,
                totalAmount: totalAmount || subtotal + tax + deliveryFee,
                deliveryAddress,
                deliveryPhone: phone,
                paymentMethod: paymentMethod, // "cod" or "counter"
                notes: specialInstructions || "",
                status: "PENDING",
                items: {
                    create: items.map((item: { productId?: string; name: string; quantity: number; price: number }) => ({
                        productId: item.productId || null,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        // Clear user's cart after order
        const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        return NextResponse.json({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: order.totalAmount,
            message: "Order placed successfully",
        }, { status: 201 });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
