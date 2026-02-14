// Premium Food Icons - SVG illustrations for a polished look
import React from "react";

interface FoodIconProps {
    type: "momos" | "rolls" | "noodles" | "curry" | "beverage" | "combo" | "empty-cart" | "package";
    size?: number;
    className?: string;
}

export function FoodIcon({ type, size = 48, className = "" }: FoodIconProps) {
    const icons: Record<string, React.ReactNode> = {
        momos: (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <ellipse cx="32" cy="36" rx="18" ry="14" fill="#FEE2E2" />
                <path d="M14 36C14 36 18 24 32 24C46 24 50 36 50 36" stroke="#D84315" strokeWidth="2" strokeLinecap="round" fill="#FFFFFF" />
                <path d="M20 32C22 28 26 26 32 26C38 26 42 28 44 32" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 24V18M28 20L32 18L36 20" stroke="#D84315" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="26" cy="34" r="2" fill="#FF6B35" opacity="0.6" />
                <circle cx="38" cy="34" r="2" fill="#FF6B35" opacity="0.6" />
                <circle cx="32" cy="38" r="1.5" fill="#FF6B35" opacity="0.6" />
            </svg>
        ),
        rolls: (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <rect x="18" y="22" width="28" height="20" rx="6" fill="#FBBF24" />
                <rect x="20" y="24" width="24" height="16" rx="4" fill="#FEF3C7" />
                <ellipse cx="32" cy="32" rx="10" ry="6" fill="#F59E0B" opacity="0.3" />
                <circle cx="26" cy="30" r="3" fill="#059669" />
                <circle cx="38" cy="30" r="3" fill="#DC2626" />
                <circle cx="32" cy="34" r="2.5" fill="#7C3AED" />
                <path d="M24 38C24 38 28 40 32 40C36 40 40 38 40 38" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        noodles: (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <ellipse cx="32" cy="40" rx="18" ry="10" fill="#FBBF24" />
                <ellipse cx="32" cy="38" rx="16" ry="8" fill="#FEF3C7" />
                <path d="M20 34C20 34 24 42 32 42C40 42 44 34 44 34" stroke="#D97706" strokeWidth="2" fill="none" />
                <path d="M24 28Q28 36 32 28Q36 36 40 28" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M26 26Q30 34 34 26Q38 34 42 26" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                <circle cx="26" cy="36" r="2" fill="#DC2626" />
                <circle cx="38" cy="36" r="2" fill="#059669" />
                <rect x="44" y="20" width="3" height="16" rx="1.5" fill="#5D4037" />
                <rect x="48" y="18" width="3" height="18" rx="1.5" fill="#5D4037" />
            </svg>
        ),
        curry: (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <ellipse cx="32" cy="38" rx="18" ry="12" fill="#F59E0B" />
                <ellipse cx="32" cy="36" rx="16" ry="10" fill="#FBBF24" />
                <ellipse cx="32" cy="34" rx="14" ry="8" fill="#FCD34D" />
                <circle cx="28" cy="34" r="3" fill="#059669" opacity="0.8" />
                <circle cx="36" cy="32" r="2.5" fill="#DC2626" opacity="0.8" />
                <circle cx="32" cy="38" r="2" fill="#7C3AED" opacity="0.6" />
                <path d="M22 24C22 24 26 18 32 18C38 18 42 24 42 24" stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <ellipse cx="27" cy="22" rx="2" ry="1" fill="#D97706" opacity="0.3" />
                <ellipse cx="37" cy="21" rx="1.5" ry="0.8" fill="#D97706" opacity="0.3" />
            </svg>
        ),
        beverage: (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <path d="M24 20H40L38 48H26L24 20Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="2" />
                <path d="M26 28H38" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.5" />
                <path d="M25 36H39" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.5" />
                <ellipse cx="32" cy="20" rx="8" ry="2" fill="#BAE6FD" />
                <circle cx="29" cy="32" r="2" fill="#FBBF24" />
                <circle cx="35" cy="30" r="1.5" fill="#DC2626" />
                <path d="M42 24L46 22L48 26" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="45" cy="22" rx="2" ry="3" fill="#059669" />
            </svg>
        ),
        combo: (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <rect x="20" y="24" width="24" height="20" rx="3" fill="#FBBF24" />
                <rect x="22" y="26" width="20" height="16" rx="2" fill="#FEF3C7" />
                <path d="M18 24L32 16L46 24" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="28" cy="32" r="3" fill="#FF6B35" />
                <circle cx="36" cy="32" r="3" fill="#059669" />
                <rect x="30" y="36" width="4" height="6" rx="1" fill="#DC2626" />
                <path d="M24 44H40" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                <circle cx="44" cy="20" r="6" fill="#FF6B35" />
                <text x="44" y="23" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">%</text>
            </svg>
        ),
        "empty-cart": (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <path d="M16 18H20L22 20L26 40H46L50 24H24" stroke="#D84315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="28" cy="48" r="4" fill="#FF6B35" />
                <circle cx="44" cy="48" r="4" fill="#FF6B35" />
                <path d="M30 28L38 36M38 28L30 36" stroke="#D84315" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        package: (
            <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
                <circle cx="32" cy="32" r="28" fill="#FFF5ED" />
                <rect x="16" y="24" width="32" height="24" rx="2" fill="#FBBF24" />
                <path d="M16 30H48" stroke="#D97706" strokeWidth="2" />
                <rect x="28" y="24" width="8" height="12" fill="#FEF3C7" />
                <path d="M32 18V24" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                <path d="M26 20L32 18L38 20" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    };

    return <>{icons[type] || icons.momos}</>;
}

// Category icon mapping
export function getCategoryIcon(category: string, size = 48) {
    const iconMap: Record<string, React.ReactNode> = {
        momos: <FoodIcon type="momos" size={size} />,
        rolls: <FoodIcon type="rolls" size={size} />,
        "north-indian": <FoodIcon type="curry" size={size} />,
        chinese: <FoodIcon type="noodles" size={size} />,
        beverages: <FoodIcon type="beverage" size={size} />,
        combos: <FoodIcon type="combo" size={size} />,
    };
    return iconMap[category] || <FoodIcon type="momos" size={size} />;
}
