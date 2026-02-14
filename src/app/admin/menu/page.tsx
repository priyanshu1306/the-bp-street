"use client";

import { useState, useEffect } from "react";
import {
    Loader2, Search, Plus, Edit, Trash2, X,
    Package, Check, ImageIcon, ChevronDown
} from "lucide-react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isVeg: boolean;
    isAvailable: boolean;
    isBestSeller: boolean;
    isTrending: boolean;
}

const categories = ["Momos", "Rolls", "Chinese", "Starters", "Biryani", "Beverages"];

const emptyProduct: Omit<Product, "id"> = {
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Momos",
    isVeg: true,
    isAvailable: true,
    isBestSeller: false,
    isTrending: false,
};

export default function AdminMenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Omit<Product, "id">>(emptyProduct);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData(emptyProduct);
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price,
            image: product.image || "",
            category: product.category,
            isVeg: product.isVeg,
            isAvailable: product.isAvailable,
            isBestSeller: product.isBestSeller,
            isTrending: product.isTrending,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) return;

        setSaving(true);
        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : "/api/products";

            const res = await fetch(url, {
                method: editingProduct ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchProducts();
                setShowModal(false);
            }
        } catch (error) {
            console.error("Failed to save product:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        } finally {
            setDeleting(null);
        }
    };

    const toggleAvailability = async (product: Product) => {
        try {
            await fetch(`/api/products/${product.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...product, isAvailable: !product.isAvailable }),
            });

            setProducts(products.map(p =>
                p.id === product.id ? { ...p, isAvailable: !p.isAvailable } : p
            ));
        } catch (error) {
            console.error("Failed to update availability:", error);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="glass-card p-4">
                    <div className="flex gap-4">
                        <div className="skeleton flex-1 h-12 rounded-xl" />
                        <div className="skeleton w-40 h-12 rounded-xl" />
                        <div className="skeleton w-32 h-12 rounded-xl" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card p-4">
                            <div className="flex gap-3">
                                <div className="skeleton w-20 h-20 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton w-3/4 h-5" />
                                    <div className="skeleton w-1/2 h-4" />
                                    <div className="skeleton w-1/4 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-orange-500/20 transition-all focus-ring"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 appearance-none cursor-pointer focus-ring min-w-[160px]"
                        >
                            <option value="all" className="bg-slate-900">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" size={16} />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity focus-ring shadow-lg shadow-orange-500/20"
                    >
                        <Plus size={20} />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-4 text-sm text-white/50">
                <span>{filteredProducts.length} items</span>
                <span>•</span>
                <span>{filteredProducts.filter(p => p.isAvailable).length} available</span>
                <span>•</span>
                <span>{filteredProducts.filter(p => !p.isAvailable).length} unavailable</span>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                        <Package size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No menu items found</h3>
                    <p className="text-sm text-white/40 max-w-sm mx-auto mb-6">
                        {search || categoryFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Start by adding your first menu item"
                        }
                    </p>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity focus-ring"
                    >
                        <Plus size={18} />
                        Add First Item
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`glass-card p-4 group ${!product.isAvailable ? "opacity-60" : ""}`}
                        >
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="text-white/20" size={24} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-white truncate group-hover:text-orange-400 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-white/40">{product.category}</p>
                                        </div>
                                        <span className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 ${product.isVeg ? "border-green-500" : "border-red-500"}`}>
                                            <span className={`w-2.5 h-2.5 rounded-sm ${product.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                                        </span>
                                    </div>
                                    <p className="font-bold text-white text-lg mt-1">₹{product.price}</p>
                                    {(product.isBestSeller || product.isTrending) && (
                                        <div className="flex gap-1 mt-2">
                                            {product.isBestSeller && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                                                    Best Seller
                                                </span>
                                            )}
                                            {product.isTrending && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                                                    Trending
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                <button
                                    onClick={() => toggleAvailability(product)}
                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${product.isAvailable
                                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                            : "bg-red-500/15 text-red-400 border-red-500/30"
                                        }`}
                                >
                                    {product.isAvailable ? "✓ Available" : "✕ Unavailable"}
                                </button>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="p-2 text-white/40 hover:text-orange-400 hover:bg-white/5 rounded-lg transition-colors focus-ring"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={deleting === product.id}
                                        className="p-2 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg disabled:opacity-50 transition-colors focus-ring"
                                        title="Delete"
                                    >
                                        {deleting === product.id ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-white/10 sticky top-0 bg-[#0f1419]/90 backdrop-blur-xl z-10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingProduct ? "Edit Item" : "Add New Item"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors focus-ring"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring"
                                    placeholder="Item name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring resize-none"
                                    placeholder="Item description"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Price *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring"
                                        placeholder="₹"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/25 focus-ring"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus-ring"
                                    placeholder="/images/products/..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <ToggleField
                                    label="Vegetarian"
                                    checked={formData.isVeg}
                                    onChange={(val) => setFormData({ ...formData, isVeg: val })}
                                />
                                <ToggleField
                                    label="Available"
                                    checked={formData.isAvailable}
                                    onChange={(val) => setFormData({ ...formData, isAvailable: val })}
                                />
                                <ToggleField
                                    label="Best Seller"
                                    checked={formData.isBestSeller}
                                    onChange={(val) => setFormData({ ...formData, isBestSeller: val })}
                                />
                                <ToggleField
                                    label="Trending"
                                    checked={formData.isTrending}
                                    onChange={(val) => setFormData({ ...formData, isTrending: val })}
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving || !formData.name || !formData.price}
                                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity focus-ring shadow-lg shadow-orange-500/20"
                            >
                                {saving ? (
                                    <><Loader2 size={20} className="animate-spin" /> Saving...</>
                                ) : (
                                    <><Check size={20} /> {editingProduct ? "Update Item" : "Add Item"}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ToggleField({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-sm font-medium text-white/70">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors focus-ring ${checked ? "bg-gradient-to-r from-orange-500 to-rose-500" : "bg-white/20"
                    }`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "left-6" : "left-1"
                        }`}
                />
            </button>
        </div>
    );
}
