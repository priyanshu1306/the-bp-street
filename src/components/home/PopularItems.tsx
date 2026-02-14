"use client";

import { useRef } from "react";
import Link from "next/link";
import { popularItems } from "@/data/menu";
import { ProductCard } from "@/components/menu/ProductCard";
import { ChevronLeft, ChevronRight, Flame, ArrowRight, Sparkles } from "lucide-react";

export function PopularItems() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
        }
    };

    return (
        <section className="py-16 bg-[var(--cream)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[var(--saffron)] text-sm font-bold mb-3 shadow-sm">
                            <Flame size={16} className="animate-pulse" /> Trending Now
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-dark)]">
                            Customer Favourites
                        </h2>
                        <p className="text-[var(--text-muted)] mt-1">Our most-loved dishes—you can&apos;t go wrong with these!</p>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="w-10 h-10 rounded-full border-2 border-[var(--border-dark)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--saffron)] hover:text-[var(--saffron)] transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-10 h-10 rounded-full border-2 border-[var(--border-dark)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--saffron)] hover:text-[var(--saffron)] transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Scroll Container */}
                <div ref={scrollRef} className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
                    {popularItems.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-72">
                            <ProductCard item={item} />
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="flex-shrink-0 w-72">
                        <Link
                            href="/menu"
                            className="h-full min-h-[380px] flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-[var(--saffron)]/30 bg-white hover:border-[var(--saffron)] hover:bg-[var(--cream)] transition-all"
                        >
                            <div className="w-16 h-16 rounded-full bg-[var(--saffron)]/10 flex items-center justify-center text-[var(--saffron)]">
                                <ArrowRight size={28} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-[var(--saffron)] text-lg">See All Menu</p>
                                <p className="text-sm text-[var(--text-muted)]">Explore 50+ items</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
