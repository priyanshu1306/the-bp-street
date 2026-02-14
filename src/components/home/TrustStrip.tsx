"use client";

import { Star, Users, Shield, Zap, ChefHat } from "lucide-react";

export function TrustStrip() {
    return (
        <section className="py-5 bg-gradient-to-r from-[var(--saffron)] to-[var(--spice)] text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between gap-6 overflow-x-auto hide-scrollbar">
                    <TrustItem icon={<Star size={20} />} value="4.3" label="Google Rating" />
                    <TrustItem icon={<Users size={20} />} value="876+" label="Happy Customers" />
                    <TrustItem icon={<Shield size={20} />} value="100%" label="Secure Payments" />
                    <TrustItem icon={<Zap size={20} />} value="30 min" label="Avg Delivery" />
                    <TrustItem icon={<ChefHat size={20} />} value="Fresh" label="Made to Order" />
                </div>
            </div>
        </section>
    );
}

function TrustItem({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="font-bold text-white leading-none">{value}</p>
                <p className="text-xs text-white/80">{label}</p>
            </div>
        </div>
    );
}
