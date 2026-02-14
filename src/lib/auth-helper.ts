import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

interface AuthUser {
    id: string;
    email: string;
    name?: string | null;
}

// Get authenticated user from either NextAuth session (web) or Bearer token (mobile)
export async function getAuthUser(request?: NextRequest): Promise<AuthUser | null> {
    // Try NextAuth session first (web)
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        return {
            id: (session.user as any).id,
            email: session.user.email,
            name: session.user.name,
        };
    }

    // Try Bearer token (mobile)
    if (request) {
        const authHeader = request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            try {
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
                return {
                    id: decoded.id,
                    email: decoded.email,
                    name: decoded.name,
                };
            } catch {
                return null;
            }
        }
    }

    return null;
}
