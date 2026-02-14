"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { menuItems, categories } from "@/data/menu";
import { ProductCard } from "@/components/menu/ProductCard";
import { Search, SlidersHorizontal, Leaf } from "lucide-react";
import { FoodIcon } from "@/components/ui/FoodIcons";

const categoryIcons: Record<string, "momos" | "rolls" | "noodles" | "curry" | "beverage" | "combo"> = {
    momos: "momos",
    rolls: "rolls",
    "north-indian": "curry",
    chinese: "noodles",
    beverages: "beverage",
    combos: "combo",
};

export default function MenuPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "all";

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(initialCategory);
    const [vegOnly, setVegOnly] = useState(false);
    const [sort, setSort] = useState("popular");

    const filtered = useMemo(() => {
        let items = [...menuItems];
        if (search) {
            items = items.filter(
                (i) =>
                    i.name.toLowerCase().includes(search.toLowerCase()) ||
                    i.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (category !== "all") {
            items = items.filter((i) => i.category === category);
        }
        if (vegOnly) {
            items = items.filter((i) => i.isVeg);
        }
        if (sort === "price-low") items.sort((a, b) => a.price - b.price);
        else if (sort === "price-high") items.sort((a, b) => b.price - a.price);
        else if (sort === "rating") items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return items;
    }, [search, category, vegOnly, sort]);

    return (
        <div className="pt-24 pb-8 food-pattern min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-2">
                        Our Menu
                    </h1>
                    <p className="text-[var(--text-muted)]">Explore our delicious street food collection</p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-light)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for momos, rolls, noodles..."
                            className="w-full py-3.5 pl-12 pr-4 bg-white border-2 border-[var(--border)] rounded-xl text-[var(--text-dark)] text-[15px] transition-all focus:outline-none focus:border-[var(--saffron)] focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)]"
                        />
                    </div>

                    {/* Veg Toggle */}
                    <button
                        onClick={() => setVegOnly(!vegOnly)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-semibold transition-all ${vegOnly
                                ? "bg-[var(--chutney)] border-[var(--chutney)] text-white"
                                : "border-[var(--border-dark)] text-[var(--text-body)] hover:border-[var(--chutney)]"
                            }`}
                    >
                        <Leaf size={18} />
                        Veg Only
                    </button>

                    {/* Sort */}
                    <div className="relative">
                        <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-light)] pointer-events-none" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full py-3.5 pl-12 pr-10 bg-white border-2 border-[var(--border)] rounded-xl text-[var(--text-dark)] text-[15px] appearance-none cursor-pointer focus:outline-none focus:border-[var(--saffron)]"
                        >
                            <option value="popular">Popular</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-6">
                    <CategoryPill
                        active={category === "all"}
                        onClick={() => setCategory("all")}
                        icon={<FoodIcon type="momos" size={24} />}
                        label="All"
                    />
                    {categories.map((cat) => (
                        <CategoryPill
                            key={cat.id}
                            active={category === cat.slug}
                            onClick={() => setCategory(cat.slug)}
                            icon={<FoodIcon type={categoryIcons[cat.slug] || "momos"} size={24} />}
                            label={cat.name}
                        />
                    ))}
                </div>

                {/* Results */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <FoodIcon type="empty-cart" size={80} className="mx-auto mb-4" />
                        <h3 className="font-bold text-[var(--text-dark)] text-xl mb-2">No items found</h3>
                        <p className="text-[var(--text-muted)]">Try adjusting your filters</p>
                    </div>
                ) : (
                    <>
                        <p className="text-[var(--text-muted)] mb-6">Showing {filtered.length} items</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {filtered.map((item) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function CategoryPill({
    active,
    onClick,
    icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${active
                    ? "bg-[var(--saffron)] text-white shadow-md"
                    : "bg-white text-[var(--text-body)] border-2 border-[var(--border)] hover:border-[var(--saffron)]"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
