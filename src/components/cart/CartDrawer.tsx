"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, UtensilsCrossed } from "lucide-react";

// Maps category to a default image
const categoryDefaultImages: Record<string, string> = {
    momos: "/images/products/steamed-momos.jpg",
    rolls: "/images/products/kathi-roll.jpg",
    "north-indian": "/images/products/paneer-butter-masala.jpg",
    chinese: "/images/products/hakka-noodles.jpg",
    beverages: "/images/products/steamed-momos.jpg",
    combos: "/images/products/fried-momos.jpg",
};

export function CartDrawer() {
    const { items, updateQuantity, removeItem, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();

    useEffect(() => {
        document.body.style.overflow = isCartOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    const tax = Math.round(totalPrice * 0.05);
    const total = totalPrice + tax;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-50 animate-fade-in" onClick={() => setIsCartOpen(false)} />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 animate-slide-in-right flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[var(--saffron)]/10 flex items-center justify-center text-[var(--saffron)]">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h2 className="font-bold text-[var(--text-dark)] text-lg">Your Cart</h2>
                            <p className="text-sm text-[var(--text-muted)]">{totalItems} items</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-9 h-9 rounded-full hover:bg-[var(--cream)] flex items-center justify-center text-[var(--text-muted)] transition-colors"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-24 h-24 rounded-full bg-[var(--cream)] flex items-center justify-center mb-4">
                                <UtensilsCrossed size={40} className="text-[var(--saffron)]" />
                            </div>
                            <h3 className="font-bold text-[var(--text-dark)] text-lg mb-1">Your cart is empty</h3>
                            <p className="text-[var(--text-muted)] mb-6">Add some yummy food!</p>
                            <button onClick={() => setIsCartOpen(false)} className="btn-primary">
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-[var(--cream)] rounded-2xl">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                        <Image
                                            src={categoryDefaultImages[item.category] || "/images/products/steamed-momos.jpg"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className={item.isVeg ? "veg-badge" : "nonveg-badge"} style={{ transform: "scale(0.8)" }} />
                                                    <h4 className="font-semibold text-[var(--text-dark)] text-sm">{item.name}</h4>
                                                </div>
                                                <p className="text-[var(--saffron)] font-bold mt-1">₹{item.price * item.quantity}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-[var(--text-light)] hover:text-[var(--spice)] transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-7 h-7 rounded-full border-2 border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--saffron)] hover:text-[var(--saffron)] transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-7 text-center text-sm font-bold text-[var(--text-dark)]">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 rounded-full bg-[var(--saffron)] flex items-center justify-center text-white"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-[var(--border)] p-5 space-y-4 bg-[var(--cream)]">
                        {/* Free Delivery Banner */}
                        <div className="flex items-center gap-3 p-3 bg-[var(--chutney)]/10 rounded-xl">
                            <Truck size={20} className="text-[var(--chutney)]" />
                            <span className="text-sm text-[var(--chutney)] font-semibold">You get FREE delivery!</span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-[var(--text-muted)]">
                                <span>Subtotal</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-muted)]">
                                <span>Delivery</span>
                                <span className="text-[var(--chutney)] font-semibold">FREE</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-muted)]">
                                <span>Taxes</span>
                                <span>₹{tax}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold text-[var(--text-dark)] pt-3 border-t border-[var(--border)]">
                            <span>Total</span>
                            <span className="text-[var(--saffron)]">₹{total}</span>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="btn-primary w-full justify-center text-lg"
                        >
                            Checkout <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
