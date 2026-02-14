"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User, Search, Menu, X, MapPin, Clock, LogOut } from "lucide-react";
import Image from "next/image";

export function Navbar() {
    const { totalItems, setIsCartOpen } = useCart();
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
                }`}
        >
            {/* Top Bar - Location & Hours */}
            {!scrolled && (
                <div className="hidden md:block bg-[var(--saffron)] text-white text-sm py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> K-3, Sector 29, Noida
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} /> Open till 11 PM
                            </span>
                        </div>
                        <span>🔥 Free delivery on orders above ₹299!</span>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                            <Image
                                src="/images/logo.jpg"
                                alt="BP Street Logo"
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </div>
                        <div>
                            <p className="font-bold text-[var(--text-dark)] text-lg leading-none">The BP Street</p>
                            <p className="text-xs text-[var(--saffron)] font-medium">Street Food • Est. 2024</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavItem href="/menu">Our Menu</NavItem>
                        <NavItem href="/offers">Today&apos;s Deals</NavItem>
                        <NavItem href="/track">Track Order</NavItem>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <Link
                            href="/menu"
                            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[var(--cream)] text-[var(--text-muted)] transition-colors"
                            title="Search Menu"
                        >
                            <Search size={20} />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center gap-2 h-11 px-5 bg-[var(--saffron)] text-white font-semibold rounded-full hover:bg-[var(--saffron-dark)] transition-all shadow-md hover:shadow-lg"
                        >
                            <ShoppingBag size={18} />
                            <span className="hidden sm:inline">Cart</span>
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--turmeric)] text-[var(--text-dark)] text-xs font-bold rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        </button>

                        {/* Account / Auth */}
                        {status === "loading" ? (
                            <div className="hidden md:flex h-11 px-5 items-center gap-2 font-semibold text-[var(--text-muted)] border-2 border-[var(--border)] rounded-full">
                                <div className="w-4 h-4 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : session ? (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/account"
                                    className="h-11 px-5 flex items-center gap-2 font-semibold text-[var(--text-dark)] border-2 border-[var(--border)] rounded-full hover:border-[var(--saffron)] hover:text-[var(--saffron)] transition-colors"
                                >
                                    <User size={18} />
                                    {session.user?.name?.split(" ")[0] || "Account"}
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="w-11 h-11 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden md:flex h-11 px-5 items-center gap-2 font-semibold text-[var(--text-dark)] border-2 border-[var(--border)] rounded-full hover:border-[var(--saffron)] hover:text-[var(--saffron)] transition-colors"
                            >
                                <User size={18} />
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--text-dark)]"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-[var(--border)] shadow-lg animate-slide-up">
                    <nav className="p-4 space-y-1">
                        <MobileNavItem href="/menu" onClick={() => setMenuOpen(false)}>🍽️ Our Menu</MobileNavItem>
                        <MobileNavItem href="/offers" onClick={() => setMenuOpen(false)}>🏷️ Today&apos;s Deals</MobileNavItem>
                        <MobileNavItem href="/track" onClick={() => setMenuOpen(false)}>📦 Track Order</MobileNavItem>
                        {session ? (
                            <>
                                <MobileNavItem href="/account" onClick={() => setMenuOpen(false)}>👤 {session.user?.name || "My Account"}</MobileNavItem>
                                <button
                                    onClick={() => { signOut(); setMenuOpen(false); }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-colors w-full text-left"
                                >
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <MobileNavItem href="/login" onClick={() => setMenuOpen(false)}>👤 Login / Sign Up</MobileNavItem>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-[var(--text-body)] font-medium hover:text-[var(--saffron)] transition-colors"
        >
            {children}
        </Link>
    );
}

function MobileNavItem({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-dark)] font-medium hover:bg-[var(--cream)] transition-colors"
        >
            {children}
        </Link>
    );
}
