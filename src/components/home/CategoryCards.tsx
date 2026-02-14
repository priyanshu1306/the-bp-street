"use client";

import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/menu";
import { ChevronRight } from "lucide-react";

export function CategoryCards() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-dark)] mb-2">
                        What&apos;s Your Craving?
                    </h2>
                    <p className="text-[var(--text-muted)]">Pick your favourite category and start exploring</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/menu?category=${cat.slug}`}
                            className="group"
                        >
                            <div className="food-card p-4 text-center h-full hover:border-[var(--saffron)] transition-all hover:shadow-lg">
                                <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[var(--cream)] to-[var(--cream-dark)] overflow-hidden group-hover:scale-110 transition-transform shadow-sm">
                                    <Image
                                        src={cat.image || `/images/categories/${cat.slug}.jpg`}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <h3 className="font-bold text-[var(--text-dark)]">{cat.name}</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-1">{cat.itemCount} items</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 text-[var(--saffron)] font-semibold hover:gap-3 transition-all"
                    >
                        View All Categories <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
