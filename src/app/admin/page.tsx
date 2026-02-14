"use client";

import { useState, useEffect } from "react";
import {
    ShoppingBag, Package, TrendingUp, TrendingDown,
    IndianRupee, Clock, Loader2, ArrowUpRight, Plus,
    Calendar, ChevronDown
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
    todayOrders: number;
}

interface RecentOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

type DateRange = "today" | "week" | "month" | "all";

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>("week");
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    const dateRangeOptions: { value: DateRange; label: string }[] = [
        { value: "today", label: "Today" },
        { value: "week", label: "Last 7 Days" },
        { value: "month", label: "This Month" },
        { value: "all", label: "All Time" },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            setStats(data.stats);
            setRecentOrders(data.recentOrders || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status.toUpperCase()) {
            case "DELIVERED":
                return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", icon: "✓" };
            case "PREPARING":
                return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", icon: "⏳" };
            case "OUT_FOR_DELIVERY":
                return { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30", icon: "🚚" };
            case "PENDING":
                return { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", icon: "⏱" };
            case "CANCELLED":
                return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", icon: "✕" };
            default:
                return { bg: "bg-white/10", text: "text-white/60", border: "border-white/20", icon: "•" };
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Skeleton Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="glass-card p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <div className="skeleton w-24 h-4" />
                                    <div className="skeleton w-20 h-8" />
                                    <div className="skeleton w-16 h-3" />
                                </div>
                                <div className="skeleton w-12 h-12 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Skeleton Table */}
                <div className="glass-card p-6">
                    <div className="skeleton w-40 h-6 mb-6" />
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="skeleton flex-1 h-12" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Date Range Selector */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm">Showing data for:</span>
                    <div className="relative">
                        <button
                            onClick={() => setShowDateDropdown(!showDateDropdown)}
                            className="flex items-center gap-2 px-4 py-2 glass-button rounded-xl text-white text-sm font-medium focus-ring"
                        >
                            <Calendar size={16} className="text-white/60" />
                            {dateRangeOptions.find(o => o.value === dateRange)?.label}
                            <ChevronDown size={16} className={`text-white/40 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showDateDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowDateDropdown(false)} />
                                <div className="absolute top-full left-0 mt-2 w-48 glass-panel py-2 z-20">
                                    {dateRangeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setDateRange(option.value);
                                                setShowDateDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors focus-ring ${dateRange === option.value
                                                ? "text-orange-400 bg-white/5"
                                                : "text-white/70 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <KPICard
                    title="Total Revenue"
                    value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
                    trend={{ value: 12.5, positive: true }}
                    icon={<IndianRupee size={22} />}
                    iconBg="from-emerald-400 to-emerald-600"
                    href="/admin/orders"
                />
                <KPICard
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    subtitle={`${stats?.todayOrders || 0} today`}
                    trend={{ value: 8.2, positive: true }}
                    icon={<ShoppingBag size={22} />}
                    iconBg="from-blue-400 to-blue-600"
                    href="/admin/orders"
                />
                <KPICard
                    title="Pending Orders"
                    value={stats?.pendingOrders || 0}
                    trend={stats?.pendingOrders && stats.pendingOrders > 0 ? { value: stats.pendingOrders, positive: false, isCount: true } : undefined}
                    icon={<Clock size={22} />}
                    iconBg="from-orange-400 to-orange-600"
                    href="/admin/orders?status=pending"
                    highlight={!!(stats?.pendingOrders && stats.pendingOrders > 0)}
                />
                <KPICard
                    title="Menu Items"
                    value={stats?.totalProducts || 0}
                    icon={<Package size={22} />}
                    iconBg="from-purple-400 to-purple-600"
                    href="/admin/menu"
                />
            </div>

            {/* Recent Orders */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                        <p className="text-sm text-white/60 mt-1">Latest customer orders</p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-2 px-4 py-2 glass-button rounded-xl text-white/70 hover:text-white text-sm font-medium transition-colors focus-ring"
                    >
                        View All <ArrowUpRight size={16} />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <EmptyState
                        icon={<ShoppingBag size={40} className="text-white/20" />}
                        title="No orders yet"
                        description="Once customers start ordering, you'll see their orders here. Make sure your menu is ready!"
                        actionLabel="Manage Menu"
                        actionHref="/admin/menu"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-white/60 border-b border-white/10">
                                    <th className="pb-4 font-medium">Order #</th>
                                    <th className="pb-4 font-medium">Customer</th>
                                    <th className="pb-4 font-medium">Amount</th>
                                    <th className="pb-4 font-medium">Status</th>
                                    <th className="pb-4 font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {recentOrders.map((order, index) => {
                                    const statusStyle = getStatusStyles(order.status);
                                    return (
                                        <tr
                                            key={order.id}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="py-4">
                                                <span className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                                                    {order.orderNumber}
                                                </span>
                                            </td>
                                            <td className="py-4 text-white/70">{order.customerName}</td>
                                            <td className="py-4">
                                                <span className="font-semibold text-white">₹{order.totalAmount}</span>
                                            </td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                    <span>{statusStyle.icon}</span>
                                                    {order.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="py-4 text-white/70">
                                                {new Date(order.createdAt).toLocaleString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <QuickActionCard
                    href="/admin/menu"
                    icon={<Package size={24} />}
                    iconBg="from-orange-400 to-rose-500"
                    title="Manage Menu"
                    description="Add, edit, or remove items"
                />
                <QuickActionCard
                    href="/admin/orders"
                    icon={<ShoppingBag size={24} />}
                    iconBg="from-blue-400 to-indigo-500"
                    title="View Orders"
                    description="Track and update orders"
                />
                <QuickActionCard
                    href="/admin/settings"
                    icon={<TrendingUp size={24} />}
                    iconBg="from-emerald-400 to-teal-500"
                    title="Store Settings"
                    description="Customize your store"
                />
            </div>
        </div>
    );
}

// KPI Card Component
function KPICard({
    title,
    value,
    subtitle,
    trend,
    icon,
    iconBg,
    href,
    highlight,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: { value: number; positive: boolean; isCount?: boolean };
    icon: React.ReactNode;
    iconBg: string;
    href: string;
    highlight?: boolean;
}) {
    return (
        <Link href={href} className="block focus-ring rounded-2xl">
            <div className={`glass-card p-6 h-full ${highlight ? 'border-orange-500/30 bg-orange-500/5' : ''}`}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-white/70 font-medium mb-2">{title}</p>
                        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {trend && (
                                <span className={`inline-flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-emerald-400' : 'text-orange-400'
                                    }`}>
                                    {trend.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {trend.isCount ? `${trend.value} pending` : `${trend.value}%`}
                                </span>
                            )}
                            {subtitle && <span className="text-xs text-white/50">{subtitle}</span>}
                        </div>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white shadow-lg`}>
                        {icon}
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Quick Action Card Component
function QuickActionCard({
    href,
    icon,
    iconBg,
    title,
    description,
}: {
    href: string;
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
}) {
    return (
        <Link href={href} className="block focus-ring rounded-2xl">
            <div className="glass-card p-6 group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-orange-400 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-white/60">{description}</p>
            </div>
        </Link>
    );
}

// Empty State Component
function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
}) {
    return (
        <div className="text-center py-12 px-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/60 max-w-sm mx-auto mb-6">{description}</p>
            <Link
                href={actionHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity focus-ring"
            >
                <Plus size={18} />
                {actionLabel}
            </Link>
        </div>
    );
}
