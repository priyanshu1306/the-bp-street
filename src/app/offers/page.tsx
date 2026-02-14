"use client";

import { useState } from "react";
import { Copy, Check, Gift, Percent, Clock, Tag } from "lucide-react";

const offers = [
    {
        id: 1,
        title: "First Bite Special 🎉",
        desc: "Get 20% off on your first order!",
        code: "FIRST20",
        bg: "from-[#FF6B35] to-[#D84315]",
        icon: <Gift size={28} />,
        valid: "New users only",
    },
    {
        id: 2,
        title: "Weekend Munch",
        desc: "Flat ₹100 off on orders above ₹500",
        code: "WEEKEND100",
        bg: "from-[#7C3AED] to-[#5B21B6]",
        icon: <Tag size={28} />,
        valid: "Sat & Sun only",
    },
    {
        id: 3,
        title: "Momo Madness 🥟",
        desc: "Buy 2 Get 1 Free on all momos!",
        code: "MOMO3",
        bg: "from-[#059669] to-[#047857]",
        icon: <Percent size={28} />,
        valid: "All week",
    },
    {
        id: 4,
        title: "Happy Hours ⏰",
        desc: "15% off between 3-6 PM daily",
        code: "HAPPY15",
        bg: "from-[#D97706] to-[#B45309]",
        icon: <Clock size={28} />,
        valid: "3 PM - 6 PM",
    },
];

export default function OffersPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="pt-24 pb-8 food-pattern min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-2">
                        Today&apos;s Deals 🏷️
                    </h1>
                    <p className="text-[var(--text-muted)]">Save big on your favourite street food!</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className={`p-6 rounded-3xl bg-gradient-to-br ${offer.bg} relative overflow-hidden shadow-lg`}
                        >
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-4">
                                    {offer.icon}
                                </div>
                                <h3 className="font-bold text-xl text-white mb-1">{offer.title}</h3>
                                <p className="text-white/90 mb-5">{offer.desc}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl font-mono font-bold text-white text-lg">
                                            {offer.code}
                                        </div>
                                        <button
                                            onClick={() => copy(offer.code)}
                                            className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-[var(--text-dark)] hover:bg-[var(--cream)] transition-colors flex items-center gap-1"
                                        >
                                            {copied === offer.code ? (
                                                <>
                                                    <Check size={16} /> Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} /> Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">{offer.valid}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Terms */}
                <div className="mt-10 p-5 bg-white rounded-2xl border border-[var(--border)] shadow-sm">
                    <h4 className="font-bold text-[var(--text-dark)] mb-3">📋 Terms & Conditions</h4>
                    <ul className="text-sm text-[var(--text-muted)] space-y-1">
                        <li>• Offers cannot be combined with other promotions</li>
                        <li>• Management reserves the right to modify or cancel offers</li>
                        <li>• Valid for a limited time only</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
