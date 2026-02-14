"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard, Package, ShoppingBag, Settings,
    Menu, X, LogOut, ChevronRight, ChevronLeft, Loader2, User
} from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/admin/menu", icon: Package, label: "Menu Items" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            if (status === "unauthenticated") {
                router.push("/login?redirect=/admin");
                return;
            }

            if (status === "authenticated" && session?.user?.email) {
                try {
                    const res = await fetch("/api/admin/check");
                    const data = await res.json();

                    if (!data.isAdmin) {
                        router.push("/");
                    } else {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    router.push("/");
                }
            }
        };

        checkAdmin();
    }, [status, session, router]);

    if (status === "loading" || isAdmin === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f1419]">
                <div className="p-8 rounded-2xl glass-card animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin text-white/70" />
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    const sidebarWidth = sidebarCollapsed ? "w-20" : "w-72";

    return (
        <div className="min-h-screen bg-[#0f1419]">
            {/* Global Styles */}
            <style jsx global>{`
                /* Glass Effect Tokens */
                .glass-card {
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 16px;
                    box-shadow: 
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .glass-card:hover {
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 
                        0 12px 40px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
                }
                .glass-panel {
                    background: linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
                }
                .glass-button {
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }
                .glass-button:hover {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(255, 255, 255, 0.25);
                }
                /* Skeleton Loading */
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .skeleton {
                    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 8px;
                }
                /* Focus styles for accessibility */
                .focus-ring:focus-visible {
                    outline: 2px solid rgba(59, 130, 246, 0.5);
                    outline-offset: 2px;
                }
                /* Smooth page transitions */
                .page-transition {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full ${sidebarWidth} transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="h-full m-4 mr-0 rounded-2xl glass-panel flex flex-col overflow-hidden">
                    {/* Logo */}
                    <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} p-5 border-b border-white/10`}>
                        <Link href="/admin" className={`flex items-center ${sidebarCollapsed ? '' : 'gap-3'}`}>
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="text-white font-bold text-lg">BP</span>
                            </div>
                            {!sidebarCollapsed && (
                                <div>
                                    <span className="font-bold text-lg text-white">Admin</span>
                                    <p className="text-xs text-white/40">Control Panel</p>
                                </div>
                            )}
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-xl text-white/60 focus-ring"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    title={sidebarCollapsed ? item.label : undefined}
                                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-ring relative group ${isActive
                                        ? "bg-white/10 text-white font-medium"
                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-400 to-rose-500 rounded-r-full" />
                                    )}
                                    <item.icon size={20} className={isActive ? "text-orange-400" : ""} />
                                    {!sidebarCollapsed && (
                                        <>
                                            <span>{item.label}</span>
                                            {isActive && <ChevronRight size={16} className="ml-auto text-white/40" />}
                                        </>
                                    )}
                                    {/* Tooltip for collapsed mode */}
                                    {sidebarCollapsed && (
                                        <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Collapse toggle (desktop only) */}
                    <div className="hidden lg:block px-3 py-2 border-t border-white/10">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors focus-ring"
                            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                            {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
                        </button>
                    </div>

                    {/* User section */}
                    <div className={`p-4 border-t border-white/10 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} mb-3 p-3 rounded-xl bg-white/5`}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                <User size={18} className="text-white" />
                            </div>
                            {!sidebarCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white text-sm truncate">{session?.user?.name}</p>
                                    <p className="text-xs text-white/40 truncate">{session?.user?.email}</p>
                                </div>
                            )}
                        </div>
                        <Link
                            href="/"
                            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} gap-2 text-white/40 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-colors focus-ring`}
                            title={sidebarCollapsed ? "Back to Store" : undefined}
                        >
                            <LogOut size={16} />
                            {!sidebarCollapsed && "Back to Store"}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} min-h-screen p-4 transition-all duration-300`}>
                {/* Top bar */}
                <header className="mb-6">
                    <div className="rounded-2xl glass-panel px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 hover:bg-white/10 rounded-xl text-white/60 focus-ring"
                                >
                                    <Menu size={24} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#ffffff' }}>
                                        {navItems.find(item =>
                                            pathname === item.href ||
                                            (item.href !== "/admin" && pathname.startsWith(item.href))
                                        )?.label || "Dashboard"}
                                    </h1>
                                    <p className="text-sm text-white/60 mt-0.5">
                                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="group relative">
                                    <span className="px-4 py-2 rounded-xl glass-button text-green-400 text-sm font-medium flex items-center gap-2 cursor-help">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        Live
                                    </span>
                                    {/* Tooltip */}
                                    <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                        Data updates in real-time
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content with animation */}
                <main className="page-transition">
                    {children}
                </main>
            </div>
        </div>
    );
}
