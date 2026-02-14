"use client";

import { useState, useEffect } from "react";
import {
    Loader2, Save, Store, Clock, Phone, MapPin,
    Mail, Globe, Check, AlertCircle, Truck, IndianRupee
} from "lucide-react";

interface StoreSettings {
    storeName: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    openingTime: string;
    closingTime: string;
    minOrderAmount: number;
    deliveryRadius: number;
    deliveryFee: number;
    freeDeliveryAbove: number;
    taxRate: number;
    isOpen: boolean;
}

const defaultSettings: StoreSettings = {
    storeName: "The BP Street",
    tagline: "North Indian Street Food",
    phone: "+91 98765 43210",
    email: "hello@bpstreet.com",
    address: "123 Food Street, New Delhi",
    openingTime: "11:00",
    closingTime: "23:00",
    minOrderAmount: 99,
    deliveryRadius: 5,
    deliveryFee: 30,
    freeDeliveryAbove: 299,
    taxRate: 5,
    isOpen: true,
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const saved = localStorage.getItem("bp-store-settings");
            if (saved) {
                setSettings(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            localStorage.setItem("bp-store-settings", JSON.stringify(settings));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-3xl">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass-card p-6">
                        <div className="skeleton w-48 h-6 mb-4" />
                        <div className="space-y-4">
                            <div className="skeleton w-full h-12 rounded-xl" />
                            <div className="skeleton w-full h-12 rounded-xl" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="skeleton h-12 rounded-xl" />
                                <div className="skeleton h-12 rounded-xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Success Message */}
            {saved && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-5 py-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check size={18} />
                    </div>
                    <span className="font-medium">Settings saved successfully!</span>
                </div>
            )}

            {/* Store Info */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                        <Store size={18} className="text-white" />
                    </div>
                    Store Information
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Store Name</label>
                        <input
                            type="text"
                            value={settings.storeName}
                            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                            className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Tagline</label>
                        <input
                            type="text"
                            value={settings.tagline}
                            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                            className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                                <Phone size={14} /> Phone
                            </label>
                            <input
                                type="tel"
                                value={settings.phone}
                                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                                <Mail size={14} /> Email
                            </label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2 flex items-center gap-2">
                            <MapPin size={14} /> Address
                        </label>
                        <textarea
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring resize-none"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Operating Hours */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                        <Clock size={18} className="text-white" />
                    </div>
                    Operating Hours
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div>
                            <span className="font-medium text-white">Store Status</span>
                            <p className="text-sm text-white/40 mt-0.5">Toggle to open or close your store</p>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
                            className={`px-5 py-2.5 rounded-xl font-medium border transition-colors focus-ring ${settings.isOpen
                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                    : "bg-red-500/15 text-red-400 border-red-500/30"
                                }`}
                        >
                            {settings.isOpen ? "✓ Open" : "✕ Closed"}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Opening Time</label>
                            <input
                                type="time"
                                value={settings.openingTime}
                                onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Closing Time</label>
                            <input
                                type="time"
                                value={settings.closingTime}
                                onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Settings */}
            <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <Truck size={18} className="text-white" />
                    </div>
                    Delivery & Pricing
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Min Order Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                            <input
                                type="number"
                                value={settings.minOrderAmount}
                                onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                                className="w-full pl-8 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Delivery Radius</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.deliveryRadius}
                                onChange={(e) => setSettings({ ...settings, deliveryRadius: Number(e.target.value) })}
                                className="w-full pr-12 p-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">km</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Delivery Fee</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                            <input
                                type="number"
                                value={settings.deliveryFee}
                                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                                className="w-full pl-8 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Free Delivery Above</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                            <input
                                type="number"
                                value={settings.freeDeliveryAbove}
                                onChange={(e) => setSettings({ ...settings, freeDeliveryAbove: Number(e.target.value) })}
                                className="w-full pl-8 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white/60 mb-2">Tax Rate</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={settings.taxRate}
                                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                                className="w-full pr-8 p-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity focus-ring shadow-lg shadow-orange-500/20"
            >
                {saving ? (
                    <><Loader2 size={20} className="animate-spin" /> Saving...</>
                ) : (
                    <><Save size={20} /> Save Settings</>
                )}
            </button>

            {/* Info Note */}
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-5 py-4 rounded-xl flex items-start gap-3 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p>
                    Settings are saved locally for demo purposes. In production, these would be stored in the database and applied across the entire site.
                </p>
            </div>
        </div>
    );
}
