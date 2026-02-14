import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helper";

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);

        if (!authUser?.email) {
            return NextResponse.json(
                { error: "Please login to view cart" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: authUser.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        let cart = await prisma.cart.findUnique({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Create cart if doesn't exist
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: user.id },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }

        // Calculate totals
        const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        return NextResponse.json({
            cart: {
                id: cart.id,
                items: cart.items.map(item => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    isVeg: item.product.isVeg,
                    quantity: item.quantity,
                    total: item.product.price * item.quantity,
                })),
                itemCount,
                subtotal,
            },
        });
    } catch (error) {
        console.error("Get cart error:", error);
        return NextResponse.json(
            { error: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);

        if (!authUser?.email) {
            return NextResponse.json(
                { error: "Please login to add items" },
                { status: 401 }
            );
        }

        const { productId, quantity = 1 } = await request.json();

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || !product.isAvailable) {
            return NextResponse.json(
                { error: "Product not available" },
                { status: 404 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: authUser.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId: user.id },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: user.id },
            });
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        });

        if (existingItem) {
            // Update quantity
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        return NextResponse.json({ message: "Item added to cart" }, { status: 201 });
    } catch (error) {
        console.error("Add to cart error:", error);
        return NextResponse.json(
            { error: "Failed to add item" },
            { status: 500 }
        );
    }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);

        if (!authUser?.email) {
            return NextResponse.json(
                { error: "Please login" },
                { status: 401 }
            );
        }

        const { itemId, quantity } = await request.json();

        if (!itemId || quantity === undefined) {
            return NextResponse.json(
                { error: "Item ID and quantity are required" },
                { status: 400 }
            );
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            await prisma.cartItem.delete({
                where: { id: itemId },
            });
            return NextResponse.json({ message: "Item removed from cart" });
        }

        await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });

        return NextResponse.json({ message: "Cart updated" });
    } catch (error) {
        console.error("Update cart error:", error);
        return NextResponse.json(
            { error: "Failed to update cart" },
            { status: 500 }
        );
    }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
    try {
        const authUser = await getAuthUser(request);

        if (!authUser?.email) {
            return NextResponse.json(
                { error: "Please login" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get("itemId");
        const clearAll = searchParams.get("clearAll");

        if (clearAll === "true") {
            const user = await prisma.user.findUnique({
                where: { email: authUser.email },
            });

            if (user) {
                const cart = await prisma.cart.findUnique({
                    where: { userId: user.id },
                });

                if (cart) {
                    await prisma.cartItem.deleteMany({
                        where: { cartId: cart.id },
                    });
                }
            }

            return NextResponse.json({ message: "Cart cleared" });
        }

        if (!itemId) {
            return NextResponse.json(
                { error: "Item ID is required" },
                { status: 400 }
            );
        }

        await prisma.cartItem.delete({
            where: { id: itemId },
        });

        return NextResponse.json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Delete cart item error:", error);
        return NextResponse.json(
            { error: "Failed to remove item" },
            { status: 500 }
        );
    }
}
