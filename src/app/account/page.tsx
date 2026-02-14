"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    User, Package, Settings, LogOut, RotateCcw, ChevronRight,
    Mail, Phone, MapPin, Edit, Loader2, Palette, Bell, Shield,
    Trash2, Check, AlertTriangle, Moon, Sun, Leaf, Flame, Waves
} from "lucide-react";

type Tab = "orders" | "settings";

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

interface Theme {
    id: string;
    name: string;
    icon: React.ReactNode;
    primary: string;
    secondary: string;
    accent: string;
}

const themes: Theme[] = [
    { id: "saffron", name: "Saffron (Default)", icon: <Flame size={18} />, primary: "#FF6B35", secondary: "#FFF5F0", accent: "#FFD93D" },
    { id: "ocean", name: "Ocean Blue", icon: <Waves size={18} />, primary: "#0077B6", secondary: "#F0F9FF", accent: "#90E0EF" },
    { id: "forest", name: "Forest Green", icon: <Leaf size={18} />, primary: "#2D6A4F", secondary: "#F0FDF4", accent: "#95D5B2" },
    { id: "midnight", name: "Midnight", icon: <Moon size={18} />, primary: "#6366F1", secondary: "#F5F3FF", accent: "#A5B4FC" },
    { id: "sunset", name: "Sunset Gold", icon: <Sun size={18} />, primary: "#D97706", secondary: "#FFFBEB", accent: "#FCD34D" },
];

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Profile settings
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [saving, setSaving] = useState(false);

    // Theme & preferences
    const [selectedTheme, setSelectedTheme] = useState("saffron");
    const [notifications, setNotifications] = useState({
        orders: true,
        offers: true,
        newsletter: false,
    });

    // Delete account
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // Load user data and orders
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            fetchOrders();
            // Load saved theme
            const savedTheme = localStorage.getItem("bp-theme") || "saffron";
            setSelectedTheme(savedTheme);
            applyTheme(savedTheme);
            // Load notification preferences
            const savedNotifs = localStorage.getItem("bp-notifications");
            if (savedNotifs) {
                setNotifications(JSON.parse(savedNotifs));
            }
        }
    }, [session]);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const applyTheme = (themeId: string) => {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            document.documentElement.style.setProperty("--saffron", theme.primary);
            document.documentElement.style.setProperty("--cream", theme.secondary);
            document.documentElement.style.setProperty("--turmeric", theme.accent);
        }
    };

    const handleThemeChange = (themeId: string) => {
        setSelectedTheme(themeId);
        localStorage.setItem("bp-theme", themeId);
        applyTheme(themeId);
    };

    const handleNotificationChange = (key: keyof typeof notifications) => {
        const newNotifs = { ...notifications, [key]: !notifications[key] };
        setNotifications(newNotifs);
        localStorage.setItem("bp-notifications", JSON.stringify(newNotifs));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await fetch("/api/auth/update-name", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: session?.user?.email, name: name.trim() }),
            });
            // Show success for a bit
            await new Promise(resolve => setTimeout(resolve, 800));
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "DELETE") return;

        setDeleting(true);
        try {
            const res = await fetch("/api/auth/delete-account", {
                method: "DELETE",
            });

            if (res.ok) {
                await signOut({ callbackUrl: "/" });
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "preparing":
                return "bg-yellow-100 text-yellow-700";
            case "pending":
                return "bg-blue-100 text-blue-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Loading state
    if (status === "loading") {
        return (
            <div className="pt-24 pb-8 food-pattern min-h-screen">
                <div className="max-w-2xl mx-auto px-4 flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--saffron)]" />
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="pt-24 pb-8 food-pattern min-h-screen">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--saffron)] to-[var(--spice)] flex items-center justify-center shadow-lg">
                        <User size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-[var(--text-dark)]">
                            Hi, {session.user?.name?.split(" ")[0] || "Food Lover"}! 👋
                        </h1>
                        <p className="text-[var(--text-muted)] flex items-center gap-1">
                            <Mail size={14} />
                            {session.user?.email}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6">
                    <TabButton active={tab === "orders"} onClick={() => setTab("orders")} icon={<Package size={18} />}>
                        My Orders
                    </TabButton>
                    <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings size={18} />}>
                        Settings
                    </TabButton>
                </div>

                {/* Orders Tab */}
                {tab === "orders" && (
                    <div className="space-y-4">
                        {loadingOrders ? (
                            <div className="food-card p-8 text-center">
                                <Loader2 className="w-6 h-6 animate-spin text-[var(--saffron)] mx-auto" />
                                <p className="mt-2 text-[var(--text-muted)]">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="food-card p-8 text-center">
                                <Package size={48} className="text-[var(--text-muted)] mx-auto mb-3" />
                                <h3 className="font-bold text-[var(--text-dark)] mb-1">No orders yet</h3>
                                <p className="text-sm text-[var(--text-muted)] mb-4">Time to explore our delicious menu!</p>
                                <button
                                    onClick={() => router.push("/menu")}
                                    className="btn-primary inline-flex"
                                >
                                    View Menu
                                </button>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="food-card p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-bold text-[var(--text-dark)]">Order #{order.orderNumber}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mb-4">
                                        <span>
                                            {order.items.slice(0, 2).map(item => `${item.name} x${item.quantity}`).join(", ")}
                                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                                        </span>
                                        <span>•</span>
                                        <span className="font-semibold text-[var(--text-dark)]">₹{order.totalAmount}</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[var(--saffron)] font-semibold hover:gap-3 transition-all">
                                        <RotateCcw size={16} /> Reorder <ChevronRight size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {tab === "settings" && (
                    <div className="space-y-6">
                        {/* Profile Section */}
                        <div className="food-card p-6">
                            <h3 className="font-bold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                                <User size={18} /> Profile
                            </h3>
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-body)] mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-body)] mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="input bg-[var(--cream)] cursor-not-allowed"
                                        value={session.user?.email || ""}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-body)] mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        placeholder="Your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-body)] mb-2">Default Address</label>
                                    <textarea
                                        className="input min-h-[80px]"
                                        placeholder="Your delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full" disabled={saving}>
                                    {saving ? (
                                        <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                    ) : (
                                        <><Check size={18} /> Save Profile</>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Theme Section */}
                        <div className="food-card p-6">
                            <h3 className="font-bold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                                <Palette size={18} /> Theme
                            </h3>
                            <div className="grid gap-3">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleThemeChange(theme.id)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedTheme === theme.id
                                                ? "border-[var(--saffron)] bg-[var(--cream)]"
                                                : "border-[var(--border)] hover:border-[var(--saffron)]/50"
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                            style={{ backgroundColor: theme.primary }}
                                        >
                                            {theme.icon}
                                        </div>
                                        <span className="font-medium text-[var(--text-dark)]">{theme.name}</span>
                                        {selectedTheme === theme.id && (
                                            <Check size={18} className="ml-auto text-[var(--saffron)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications Section */}
                        <div className="food-card p-6">
                            <h3 className="font-bold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                                <Bell size={18} /> Notifications
                            </h3>
                            <div className="space-y-4">
                                <ToggleSetting
                                    label="Order Updates"
                                    description="Get notified about your order status"
                                    checked={notifications.orders}
                                    onChange={() => handleNotificationChange("orders")}
                                />
                                <ToggleSetting
                                    label="Special Offers"
                                    description="Receive discounts and promotional offers"
                                    checked={notifications.offers}
                                    onChange={() => handleNotificationChange("offers")}
                                />
                                <ToggleSetting
                                    label="Newsletter"
                                    description="Weekly updates about new items"
                                    checked={notifications.newsletter}
                                    onChange={() => handleNotificationChange("newsletter")}
                                />
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="food-card p-6">
                            <h3 className="font-bold text-[var(--text-dark)] mb-4 flex items-center gap-2">
                                <Shield size={18} /> Account
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-3 text-[var(--saffron)] font-semibold hover:bg-[var(--cream)] rounded-xl transition-colors border-2 border-[var(--border)]"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors border-2 border-red-200"
                                >
                                    <Trash2 size={18} /> Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Account Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle size={32} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-dark)]">Delete Account?</h3>
                                <p className="text-sm text-[var(--text-muted)] mt-2">
                                    This action cannot be undone. All your data, orders, and preferences will be permanently deleted.
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                                    Type <span className="font-bold text-red-500">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Type DELETE"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                                    className="flex-1 py-3 rounded-xl font-semibold border-2 border-[var(--border)] hover:bg-[var(--cream)] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== "DELETE" || deleting}
                                    className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <><Loader2 size={18} className="animate-spin" /> Deleting...</>
                                    ) : (
                                        <><Trash2 size={18} /> Delete</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    children,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${active
                ? "bg-[var(--saffron)] text-white shadow-md"
                : "bg-white text-[var(--text-muted)] border-2 border-[var(--border)] hover:border-[var(--saffron)]"
                }`}
        >
            {icon}
            {children}
        </button>
    );
}

function ToggleSetting({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-[var(--text-dark)]">{label}</p>
                <p className="text-sm text-[var(--text-muted)]">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative w-12 h-7 rounded-full transition-colors ${checked ? "bg-[var(--saffron)]" : "bg-gray-300"
                    }`}
            >
                <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "left-6" : "left-1"
                        }`}
                />
            </button>
        </div>
    );
}
