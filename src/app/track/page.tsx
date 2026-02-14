"use client";

import { useState } from "react";
import { Search, Package, ChefHat, Truck, CheckCircle, MessageCircle } from "lucide-react";
import { FoodIcon } from "@/components/ui/FoodIcons";

const steps = [
    { id: 1, label: "Order Placed", icon: Package, desc: "Order confirmed" },
    { id: 2, label: "Preparing", icon: ChefHat, desc: "Being prepared" },
    { id: 3, label: "On the Way", icon: Truck, desc: "Out for delivery" },
    { id: 4, label: "Delivered", icon: CheckCircle, desc: "Enjoy!" },
];

export default function TrackPage() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<{ id: string; status: number } | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId.trim()) {
            setOrder({ id: orderId.toUpperCase(), status: Math.floor(Math.random() * 3) + 1 });
        }
    };

    return (
        <div className="pt-24 pb-8 food-pattern min-h-screen">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--saffron)]/10 flex items-center justify-center">
                        <Package size={32} className="text-[var(--saffron)]" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-2">
                        Track Your Order
                    </h1>
                    <p className="text-[var(--text-muted)]">Enter your order ID to see what&apos;s cooking!</p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="Enter Order ID (e.g., BP12345)"
                            className="input pr-4"
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        <Search size={18} /> Track
                    </button>
                </form>

                {order && (
                    <div className="food-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">Order ID</p>
                                <p className="font-bold text-[var(--text-dark)] text-xl">#{order.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[var(--text-muted)]">Estimated</p>
                                <p className="font-bold text-[var(--saffron)] text-xl">20-30 mins</p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="relative mb-10">
                            <div className="absolute top-5 left-5 right-5 h-1.5 bg-[var(--cream-dark)] rounded-full">
                                <div
                                    className="h-full bg-[var(--saffron)] rounded-full transition-all duration-500"
                                    style={{ width: `${((order.status - 1) / (steps.length - 1)) * 100}%` }}
                                />
                            </div>

                            <div className="flex justify-between relative">
                                {steps.map((step) => {
                                    const Icon = step.icon;
                                    const isActive = step.id <= order.status;
                                    return (
                                        <div key={step.id} className="flex flex-col items-center">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${isActive
                                                        ? "bg-[var(--saffron)] text-white shadow-md"
                                                        : "bg-[var(--cream-dark)] text-[var(--text-light)]"
                                                    }`}
                                            >
                                                <Icon size={20} />
                                            </div>
                                            <p className={`text-xs mt-2 font-semibold text-center ${isActive ? "text-[var(--text-dark)]" : "text-[var(--text-light)]"}`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Status */}
                        <div className="text-center p-6 bg-[var(--cream)] rounded-2xl">
                            {(() => {
                                const CurrentIcon = steps[order.status - 1].icon;
                                return <CurrentIcon size={40} className="mx-auto text-[var(--saffron)] mb-3" />;
                            })()}
                            <p className="font-bold text-[var(--text-dark)] text-xl">{steps[order.status - 1].label}</p>
                            <p className="text-[var(--text-muted)] mt-1">
                                {order.status === 1 && "Your order has been confirmed!"}
                                {order.status === 2 && "Our chef is preparing your food with love!"}
                                {order.status === 3 && "Your order is on the way! Almost there!"}
                                {order.status === 4 && "Order delivered! Enjoy your meal!"}
                            </p>
                        </div>

                        {/* WhatsApp Support */}
                        <a
                            href="https://wa.me/919876543210"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 mt-6 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
                        >
                            <MessageCircle size={22} /> Need help? Chat with us
                        </a>
                    </div>
                )}

                {!order && (
                    <div className="text-center py-16 food-card">
                        <FoodIcon type="noodles" size={80} className="mx-auto mb-4" />
                        <p className="text-[var(--text-muted)] text-lg">Enter your order ID above to track</p>
                    </div>
                )}
            </div>
        </div>
    );
}
