"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/data/menu";
import { Plus, Minus, Star, Flame } from "lucide-react";

// Maps category to a default image if the specific menu item image doesn't exist
const categoryDefaultImages: Record<string, string> = {
    momos: "/images/products/steamed-momos.jpg",
    rolls: "/images/products/kathi-roll.jpg",
    "north-indian": "/images/products/paneer-butter-masala.jpg",
    chinese: "/images/products/hakka-noodles.jpg",
    beverages: "/images/products/steamed-momos.jpg", // fallback
    combos: "/images/products/fried-momos.jpg",
};

// Get the best available image for a menu item
function getItemImage(item: MenuItem): string {
    // Use the item's specific image path if available, otherwise use category default
    return categoryDefaultImages[item.category] || "/images/products/steamed-momos.jpg";
}

export function ProductCard({ item }: { item: MenuItem }) {
    const { addItem, getItemQuantity, updateQuantity } = useCart();
    const qty = getItemQuantity(item.id);

    return (
        <div className="food-card h-full flex flex-col group">
            {/* Image Area */}
            <div className="relative aspect-square bg-gradient-to-br from-[var(--cream)] to-[var(--cream-dark)] overflow-hidden">
                <Image
                    src={getItemImage(item)}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <div className={item.isVeg ? "veg-badge" : "nonveg-badge"} />
                    {item.isBestSeller && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[var(--saffron)] to-[var(--turmeric)] text-white text-[10px] font-bold rounded-full shadow-sm">
                            <Flame size={10} /> BEST
                        </span>
                    )}
                    {item.isNew && (
                        <span className="px-2 py-1 bg-[var(--chutney)] text-white text-[10px] font-bold rounded-full">
                            NEW
                        </span>
                    )}
                </div>

                {item.originalPrice && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--chutney)] text-white text-[10px] font-bold rounded-full">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col">
                <h3 className="font-bold text-[var(--text-dark)] line-clamp-1">{item.name}</h3>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1 flex-1">{item.description}</p>

                {item.rating && (
                    <div className="flex items-center gap-1 mt-2">
                        <Star size={14} className="text-[var(--turmeric)] fill-[var(--turmeric)]" />
                        <span className="text-sm font-semibold text-[var(--text-dark)]">{item.rating}</span>
                        <span className="text-xs text-[var(--text-muted)]">({item.reviews})</span>
                    </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-[var(--saffron)]">₹{item.price}</span>
                        {item.originalPrice && (
                            <span className="text-sm text-[var(--text-light)] line-through">₹{item.originalPrice}</span>
                        )}
                    </div>

                    {qty === 0 ? (
                        <button
                            onClick={() => addItem(item)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[var(--saffron)] text-white text-sm font-bold rounded-full hover:bg-[var(--saffron-dark)] transition-all shadow-md hover:shadow-lg"
                        >
                            Add <Plus size={16} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 bg-[var(--saffron)] rounded-full p-1">
                            <button
                                onClick={() => updateQuantity(item.id, qty - 1)}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-6 text-center text-white font-bold">{qty}</span>
                            <button
                                onClick={() => addItem(item)}
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--saffron)] hover:bg-[var(--cream)] transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
