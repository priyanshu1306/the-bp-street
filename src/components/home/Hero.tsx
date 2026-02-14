"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Star, MessageCircle, Zap, Flame, ChefHat, Truck, Sparkles } from "lucide-react";

export function Hero() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-28 md:pt-36 food-pattern">
            {/* Warm Gradient Orbs */}
            <div className="absolute top-20 -left-40 w-96 h-96 bg-[var(--saffron)] opacity-10 rounded-full blur-[120px]" />
            <div className="absolute bottom-20 -right-40 w-96 h-96 bg-[var(--turmeric)] opacity-15 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div
                        className={`text-center lg:text-left transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--cream-dark)] border border-[var(--border)] rounded-full text-sm mb-6">
                            <span className="flex items-center gap-1 text-[var(--saffron)] font-semibold">
                                <Flame size={16} className="animate-pulse" /> Hot & Fresh
                            </span>
                            <span className="text-[var(--text-muted)]">• Made with love</span>
                        </div>

                        {/* Headline - Sharpened for hunger-driven copy */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-[var(--text-dark)]">
                            <span className="gradient-text">Street-Style Momos & Rolls,</span>
                            <br />
                            Delivered Hot.
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg text-[var(--text-body)] max-w-lg mx-auto lg:mx-0 mb-8">
                            From <strong>steaming momos</strong> to <strong>spicy rolls</strong>, experience the authentic taste of North Indian streets—delivered hot to your doorstep in under 30 minutes!
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4">
                            <Link href="/menu" className="btn-primary text-lg">
                                Order Now
                                <ArrowRight size={20} />
                            </Link>
                            <Link href="/menu" className="btn-secondary text-lg">
                                <Sparkles size={18} /> View Full Menu
                            </Link>
                        </div>

                        {/* Urgency Text */}
                        <p className="text-sm text-[var(--text-muted)] mb-10 flex items-center gap-1 justify-center lg:justify-start">
                            <Flame size={14} className="text-[var(--saffron)]" />
                            <span>Free delivery on orders above ₹299</span>
                        </p>

                        {/* Trust Signals - Enhanced with emotional copy */}
                        <div className="flex items-center gap-6 justify-center lg:justify-start flex-wrap">
                            <TrustItem icon={<Star size={22} className="text-[var(--turmeric)]" />} value="4.3 Rating" label="" bold />
                            <div className="w-px h-8 bg-[var(--border)]" />
                            <TrustItem icon={<MessageCircle size={22} className="text-[var(--saffron)]" />} value="Loved by 876+" label="customers" />
                            <div className="w-px h-8 bg-[var(--border)]" />
                            <TrustItem icon={<Zap size={22} className="text-[var(--chutney)]" />} value="Hot food in" label="~30 minutes" />
                        </div>
                    </div>

                    {/* Visual - Food Display */}
                    <div
                        className={`relative hidden lg:flex items-center justify-center transition-all duration-700 delay-200 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                    >
                        <div className="relative">
                            {/* Main Food Circle */}
                            <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[var(--cream)] to-[var(--cream-dark)] border-4 border-white shadow-2xl flex items-center justify-center animate-float overflow-hidden">
                                <Image
                                    src="/images/products/steamed-momos.jpg"
                                    alt="Steamed Momos"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Feature Cards - Only 2 badges */}
                            <div className="absolute -top-8 -right-4 bg-white rounded-2xl p-3 shadow-lg border border-[var(--border)] animate-float" style={{ animationDelay: "0.3s" }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--chutney)]/10 flex items-center justify-center">
                                        <Truck size={20} className="text-[var(--chutney)]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-dark)] text-sm">Fast Delivery</p>
                                        <p className="text-xs text-[var(--text-muted)]">Under 30 min</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-8 left-8 bg-white rounded-2xl p-3 shadow-lg border border-[var(--border)] animate-float" style={{ animationDelay: "0.6s" }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--saffron)]/10 flex items-center justify-center">
                                        <ChefHat size={20} className="text-[var(--saffron)]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-dark)] text-sm">Made Fresh</p>
                                        <p className="text-xs text-[var(--text-muted)]">After you order</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TrustItem({ icon, value, label, bold }: { icon: React.ReactNode; value: string; label: string; bold?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <div>
                <p className={`${bold ? 'font-extrabold' : 'font-semibold'} text-[var(--text-dark)] leading-none`}>{value}</p>
                {label && <p className="text-xs text-[var(--text-muted)]">{label}</p>}
            </div>
        </div>
    );
}
