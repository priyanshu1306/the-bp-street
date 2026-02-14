"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import {
    MapPin, Clock, Phone, User, Loader2, Check,
    ShoppingBag, Truck, Store, CreditCard, Banknote,
    ChevronRight, AlertCircle
} from "lucide-react";

type DeliveryType = "delivery" | "pickup";
type PaymentMethod = "cod" | "counter";

interface Address {
    flat: string;
    street: string;
    city: string;
    pincode: string;
    phone: string;
}

export default function CheckoutPage() {
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();

    const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
    const [payment, setPayment] = useState<PaymentMethod>("cod");
    const [address, setAddress] = useState<Address>({
        flat: "",
        street: "",
        city: "",
        pincode: "",
        phone: "",
    });
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [isPlacing, setIsPlacing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [error, setError] = useState("");

    // Redirect to login if not authenticated
    useEffect(() => {
        if (authStatus === "unauthenticated") {
            router.push("/login?redirect=/checkout");
        }
    }, [authStatus, router]);

    // Calculate totals
    const subtotal = totalPrice;
    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = deliveryType === "delivery" ? (subtotal >= 299 ? 0 : 30) : 0;
    const total = subtotal + tax + deliveryFee;

    // Check if form is valid
    const isFormValid = () => {
        if (deliveryType === "delivery") {
            return address.flat && address.street && address.city && address.pincode && address.phone;
        }
        return address.phone;
    };

    const handlePlaceOrder = async () => {
        if (!isFormValid()) {
            setError("Please fill in all required fields");
            return;
        }

        setIsPlacing(true);
        setError("");

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    deliveryType,
                    paymentMethod: payment,
                    address: deliveryType === "delivery" ? address : null,
                    phone: address.phone,
                    specialInstructions,
                    subtotal,
                    tax,
                    deliveryFee,
                    totalAmount: total,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to place order");
                return;
            }

            setOrderId(data.orderNumber || data.id);
            setOrderPlaced(true);
            clearCart();
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsPlacing(false);
        }
    };

    // Loading state
    if (authStatus === "loading") {
        return (
            <div className="pt-24 pb-8 food-pattern min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--saffron)]" />
            </div>
        );
    }

    // Empty cart
    if (items.length === 0 && !orderPlaced) {
        return (
            <div className="pt-24 pb-8 food-pattern min-h-screen">
                <div className="max-w-md mx-auto px-4 text-center py-16">
                    <ShoppingBag size={64} className="mx-auto text-[var(--text-muted)] mb-4" />
                    <h2 className="text-xl font-bold text-[var(--text-dark)] mb-2">Your cart is empty</h2>
                    <p className="text-[var(--text-muted)] mb-6">Add some delicious items to checkout</p>
                    <Link href="/menu" className="btn-primary inline-flex">
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    // Order success
    if (orderPlaced) {
        return (
            <div className="pt-24 pb-8 food-pattern min-h-screen">
                <div className="max-w-md mx-auto px-4 text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--chutney)] flex items-center justify-center">
                        <Check size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-dark)] mb-2">Order Placed! 🎉</h2>
                    <p className="text-[var(--text-muted)] mb-2">
                        Your order ID is <span className="font-bold text-[var(--saffron)]">#{orderId}</span>
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mb-6">
                        {deliveryType === "delivery"
                            ? "Estimated delivery: 25-35 minutes"
                            : "Ready for pickup in: 15-20 minutes"}
                    </p>

                    <div className="food-card p-4 text-left mb-6">
                        <h3 className="font-semibold text-[var(--text-dark)] mb-2">Order Details</h3>
                        <div className="space-y-1 text-sm text-[var(--text-muted)]">
                            <p>📦 {deliveryType === "delivery" ? "Delivery" : "Pickup"}</p>
                            <p>💳 {payment === "cod" ? "Cash on Delivery" : "Pay at Counter"}</p>
                            <p>💰 Total: ₹{total}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/track" className="btn-primary flex-1">
                            Track Order
                        </Link>
                        <Link href="/menu" className="flex-1 py-3 rounded-xl font-semibold border-2 border-[var(--border)] hover:bg-[var(--cream)] transition-colors text-center">
                            Order More
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-8 food-pattern min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-6">Checkout</h1>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Type */}
                        <div className="food-card p-5">
                            <h3 className="font-semibold text-[var(--text-dark)] mb-4">Delivery Type</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { setDeliveryType("delivery"); setPayment("cod"); }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryType === "delivery"
                                            ? "border-[var(--saffron)] bg-[var(--saffron)]/5"
                                            : "border-[var(--border)] hover:border-[var(--saffron)]/50"
                                        }`}
                                >
                                    <Truck size={28} className={deliveryType === "delivery" ? "text-[var(--saffron)]" : "text-[var(--text-muted)]"} />
                                    <p className="font-semibold text-[var(--text-dark)] mt-2">Delivery</p>
                                    <p className="text-xs text-[var(--text-muted)]">25-35 mins • Free above ₹299</p>
                                </button>
                                <button
                                    onClick={() => { setDeliveryType("pickup"); setPayment("counter"); }}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${deliveryType === "pickup"
                                            ? "border-[var(--saffron)] bg-[var(--saffron)]/5"
                                            : "border-[var(--border)] hover:border-[var(--saffron)]/50"
                                        }`}
                                >
                                    <Store size={28} className={deliveryType === "pickup" ? "text-[var(--saffron)]" : "text-[var(--text-muted)]"} />
                                    <p className="font-semibold text-[var(--text-dark)] mt-2">Pickup</p>
                                    <p className="text-xs text-[var(--text-muted)]">15-20 mins • Save delivery fee</p>
                                </button>
                            </div>
                        </div>

                        {/* Address (for delivery) */}
                        {deliveryType === "delivery" && (
                            <div className="food-card p-5">
                                <h3 className="font-semibold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                                    <MapPin size={18} /> Delivery Address
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Flat / House No. *"
                                        value={address.flat}
                                        onChange={(e) => setAddress({ ...address, flat: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Street / Area *"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="City *"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Pincode *"
                                            value={address.pincode}
                                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact */}
                        <div className="food-card p-5">
                            <h3 className="font-semibold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                                <Phone size={18} /> Contact Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="w-16 h-12 flex items-center justify-center bg-[var(--cream)] border-2 border-[var(--border)] rounded-xl text-sm font-semibold">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        className="input flex-1"
                                        placeholder="Phone Number *"
                                        value={address.phone}
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-muted)]">We'll send order updates on this number</p>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="food-card p-5">
                            <h3 className="font-semibold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                                <CreditCard size={18} /> Payment Method
                            </h3>
                            <div className="space-y-3">
                                {deliveryType === "delivery" ? (
                                    <button
                                        onClick={() => setPayment("cod")}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${payment === "cod"
                                                ? "border-[var(--saffron)] bg-[var(--saffron)]/5"
                                                : "border-[var(--border)] hover:border-[var(--saffron)]/50"
                                            }`}
                                    >
                                        <Banknote size={24} className={payment === "cod" ? "text-[var(--saffron)]" : "text-[var(--text-muted)]"} />
                                        <div className="text-left flex-1">
                                            <p className="font-semibold text-[var(--text-dark)]">Cash on Delivery</p>
                                            <p className="text-xs text-[var(--text-muted)]">Pay when your order arrives</p>
                                        </div>
                                        {payment === "cod" && (
                                            <Check size={20} className="text-[var(--saffron)]" />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setPayment("counter")}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${payment === "counter"
                                                ? "border-[var(--saffron)] bg-[var(--saffron)]/5"
                                                : "border-[var(--border)] hover:border-[var(--saffron)]/50"
                                            }`}
                                    >
                                        <Store size={24} className={payment === "counter" ? "text-[var(--saffron)]" : "text-[var(--text-muted)]"} />
                                        <div className="text-left flex-1">
                                            <p className="font-semibold text-[var(--text-dark)]">Pay at Counter</p>
                                            <p className="text-xs text-[var(--text-muted)]">Cash or UPI when you pickup</p>
                                        </div>
                                        {payment === "counter" && (
                                            <Check size={20} className="text-[var(--saffron)]" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="food-card p-5">
                            <h3 className="font-semibold text-[var(--text-dark)] mb-4">Special Instructions (Optional)</h3>
                            <textarea
                                className="input min-h-[80px]"
                                placeholder="Any special requests? (e.g., extra spicy, no onion)"
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right - Summary */}
                    <div className="lg:col-span-1">
                        <div className="food-card p-5 sticky top-24">
                            <h3 className="font-semibold text-[var(--text-dark)] mb-4">Order Summary</h3>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-[var(--text-muted)]">
                                            {item.name} <span className="text-[var(--text-dark)]">x{item.quantity}</span>
                                        </span>
                                        <span className="font-medium text-[var(--text-dark)]">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-[var(--border)] pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-[var(--text-muted)]">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-[var(--text-muted)]">
                                    <span>Delivery Fee</span>
                                    <span className={deliveryFee === 0 ? "text-[var(--chutney)] font-medium" : ""}>
                                        {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[var(--text-muted)]">
                                    <span>Taxes (5%)</span>
                                    <span>₹{tax}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-[var(--text-dark)] pt-4 mt-4 border-t border-[var(--border)]">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacing || !isFormValid()}
                                className="btn-primary w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPlacing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        Placing Order...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Place Order <ChevronRight size={20} />
                                    </span>
                                )}
                            </button>

                            <p className="text-xs text-center text-[var(--text-muted)] mt-3">
                                By placing this order, you agree to our terms of service
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
