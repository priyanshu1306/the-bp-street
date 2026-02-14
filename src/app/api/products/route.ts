import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const isVeg = searchParams.get("isVeg");
        const bestSellers = searchParams.get("bestSellers");
        const trending = searchParams.get("trending");

        // Build filter conditions
        const where: any = {
            isAvailable: true,
        };

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        if (isVeg === "true") {
            where.isVeg = true;
        } else if (isVeg === "false") {
            where.isVeg = false;
        }

        if (bestSellers === "true") {
            where.isBestSeller = true;
        }

        if (trending === "true") {
            where.isTrending = true;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Get products error:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, image, category, isVeg, isBestSeller, isTrending } = body;

        if (!name || !price || !category) {
            return NextResponse.json(
                { error: "Name, price, and category are required" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                description: description || "",
                price: parseFloat(price),
                image: image || "",
                category,
                isVeg: isVeg ?? true,
                isBestSeller: isBestSeller ?? false,
                isTrending: isTrending ?? false,
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
