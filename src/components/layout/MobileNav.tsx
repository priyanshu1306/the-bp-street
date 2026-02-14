"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Home, UtensilsCrossed, Tag, User, ShoppingBag } from "lucide-react";

export function MobileNav() {
    const pathname = usePathname();
    const { totalItems, setIsCartOpen } = useCart();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--border)] shadow-lg">
            <div className="flex items-center justify-around h-16 px-2">
                <NavItem href="/" active={pathname === "/"} Icon={Home} label="Home" />
                <NavItem href="/menu" active={pathname === "/menu"} Icon={UtensilsCrossed} label="Menu" />

                {/* Cart - Center, Prominent */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative -mt-6"
                >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--saffron)] to-[var(--spice)] flex items-center justify-center text-white shadow-lg">
                        <ShoppingBag size={24} />
                    </div>
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--turmeric)] text-[var(--text-dark)] text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {totalItems > 9 ? "9+" : totalItems}
                        </span>
                    )}
                </button>

                <NavItem href="/offers" active={pathname === "/offers"} Icon={Tag} label="Deals" />
                <NavItem href="/account" active={pathname === "/account"} Icon={User} label="Account" />
            </div>
        </nav>
    );
}

function NavItem({ href, active, Icon, label }: { href: string; active: boolean; Icon: React.ComponentType<{ size?: number }>; label: string }) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-colors ${active ? "text-[var(--saffron)]" : "text-[var(--text-muted)]"
                }`}
        >
            <Icon size={22} />
            <span className="text-[10px] font-semibold">{label}</span>
        </Link>
    );
}
