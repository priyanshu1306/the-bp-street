"use client";

import { useState, useEffect } from "react";
import {
    Loader2, Search, Filter, Eye, ChevronDown, X,
    Phone, MapPin, Clock, Package, ShoppingBag
} from "lucide-react";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    deliveryAddress: string;
    deliveryPhone: string;
    notes: string;
    createdAt: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

const statusOptions = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setOrders(orders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            }
        } catch (error) {
            console.error("Failed to update order:", error);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "DELIVERED":
                return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", icon: "✓" };
            case "PREPARING":
                return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", icon: "⏳" };
            case "OUT_FOR_DELIVERY":
                return { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30", icon: "🚚" };
            case "CONFIRMED":
                return { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30", icon: "✓" };
            case "PENDING":
                return { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", icon: "⏱" };
            case "CANCELLED":
                return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", icon: "✕" };
            default:
                return { bg: "bg-white/10", text: "text-white/60", border: "border-white/20", icon: "•" };
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            order.customerName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="glass-card p-4">
                    <div className="flex gap-4">
                        <div className="skeleton flex-1 h-10 rounded-xl" />
                        <div className="skeleton w-40 h-10 rounded-xl" />
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton h-16 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="glass-card p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-orange-500/20 transition-all focus-ring"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 appearance-none cursor-pointer focus-ring"
                        >
                            <option value="all" className="bg-slate-900">All Status</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status} className="bg-slate-900">
                                    {status.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                            <ShoppingBag size={32} className="text-white/20" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No orders found</h3>
                        <p className="text-sm text-white/40 max-w-sm mx-auto">
                            {search || statusFilter !== "all"
                                ? "Try adjusting your search or filter criteria"
                                : "Orders will appear here once customers start placing them"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-white/40 border-b border-white/10">
                                    <th className="px-6 py-4 font-medium">Order #</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Payment</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredOrders.map((order) => {
                                    const statusStyle = getStatusStyles(order.status);
                                    return (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-white">{order.orderNumber}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-white font-medium">{order.customerName}</p>
                                                <p className="text-xs text-white/40">{order.customerEmail}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-white">₹{order.totalAmount}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-white/60 capitalize">
                                                    {order.paymentMethod === "cod" ? "COD" : order.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    disabled={updating}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer bg-transparent focus:outline-none focus-ring ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status} className="bg-slate-900 text-white">
                                                            {status.replace("_", " ")}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-white/50">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-white/50 hover:text-orange-400 hover:bg-white/5 rounded-xl transition-colors focus-ring"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-white/10 sticky top-0 bg-[#0f1419]/90 backdrop-blur-xl z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Order #{selectedOrder.orderNumber}
                                    </h2>
                                    <p className="text-sm text-white/40 mt-1">
                                        {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors focus-ring"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-white/60">Order Status</label>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                    disabled={updating}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status} className="bg-slate-900">
                                            {status.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-white/60">Customer Details</h3>
                                <div className="p-4 rounded-xl bg-white/5 space-y-3">
                                    <p className="font-medium text-white">{selectedOrder.customerName}</p>
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                        <Phone size={14} />
                                        <span>{selectedOrder.deliveryPhone || "Not provided"}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-white/60">
                                        <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                        <span>{selectedOrder.deliveryAddress || "Pickup order"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-white/60">Order Items</h3>
                                <div className="p-4 rounded-xl bg-white/5 space-y-3">
                                    {selectedOrder.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-white/80">
                                                {item.name} <span className="text-white/40">×{item.quantity}</span>
                                            </span>
                                            <span className="text-white font-medium">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-white/10 pt-3 flex justify-between">
                                        <span className="font-medium text-white">Total</span>
                                        <span className="font-bold text-white text-lg">₹{selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-white/60">Special Instructions</h3>
                                    <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                                        {selectedOrder.notes}
                                    </p>
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="flex items-center justify-between text-sm p-4 rounded-xl bg-white/5">
                                <span className="text-white/60">Payment Method</span>
                                <span className="font-medium text-white capitalize">
                                    {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : selectedOrder.paymentMethod}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
