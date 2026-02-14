"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    if (isAdminPage) {
        // Admin pages - no navbar, no mobile nav, no cart drawer
        return <>{children}</>;
    }

    // Regular pages - show all navigation
    return (
        <>
            <Navbar />
            <main className="pb-20 md:pb-0">{children}</main>
            <MobileNav />
            <CartDrawer />
        </>
    );
}
