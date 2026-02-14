"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

interface Review {
    id: number;
    name: string;
    rating: number;
    timeAgo: string;
    orderType: string;
    priceRange: string;
    text: string;
    image?: string;
}

const reviews: Review[] = [
    {
        id: 1,
        name: "Pratibha Sharma",
        rating: 5,
        timeAgo: "3 months ago",
        orderType: "Dine in | Dinner",
        priceRange: "₹200–400",
        text: "It's amazing during Diwali time when everything is fully decorated, and the food is really good. All types of food are available at the same place, including both vegetarian and non-vegetarian options, as well as sweets, snacks, and street food. We especially visit for the galoti kebab, which is fully vegetarian and has a superb taste. However, there is a lack of seating in the evening.",
    },
    {
        id: 2,
        name: "Karan Singh",
        rating: 5,
        timeAgo: "2 weeks ago",
        orderType: "Takeaway",
        priceRange: "₹800–1,000",
        text: "Great place to hang out in Noida! The BP Street has a very lively vibe with multiple food joints, cafes and dessert spots all in one place. The ambience is clean, modern and perfect for friends, couples or even a quick family outing.",
    },
    {
        id: 3,
        name: "Shashwat Vashishtha",
        rating: 5,
        timeAgo: "4 months ago",
        orderType: "Dine in",
        priceRange: "₹200–400",
        text: "Superb experience! Nice place to visit with family and friends. Quality of food was awesome. Highly recommended for North Indian and Chinese cuisine lovers. Food: 5/5 | Service: 5/5 | Atmosphere: 5/5",
    },
    {
        id: 4,
        name: "Deepak Kumar",
        rating: 5,
        timeAgo: "a week ago",
        orderType: "Walk-in",
        priceRange: "₹1–200",
        text: "Having their food from last 6-7 years, not a single % of change in taste. Every other time super delicious. You must try atleast once, you will go second by your own. Food: 5/5 | Service: 5/5 | Atmosphere: 5/5",
    },
];

export function Reviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <section className="py-16 bg-[var(--cream)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-3">
                        What Our Customers Say
                    </h2>
                    <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                        Real reviews from our happy customers on Google
                    </p>
                </div>

                {/* Slider */}
                <div
                    className="relative max-w-4xl mx-auto"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white shadow-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--saffron)] hover:border-[var(--saffron)] transition-colors z-10"
                        aria-label="Previous review"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white shadow-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--saffron)] hover:border-[var(--saffron)] transition-colors z-10"
                        aria-label="Next review"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Review Card */}
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-[var(--border)] relative overflow-hidden">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 text-[var(--saffron)]/10">
                            <Quote size={80} />
                        </div>

                        {/* Review Content */}
                        <div className="relative z-10">
                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-[var(--turmeric)] text-[var(--turmeric)]" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-lg text-[var(--text-body)] leading-relaxed mb-6">
                                &ldquo;{reviews[currentIndex].text}&rdquo;
                            </p>

                            {/* Reviewer Info */}
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--saffron)] to-[var(--turmeric)] flex items-center justify-center text-white font-bold text-lg">
                                        {reviews[currentIndex].name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-dark)]">{reviews[currentIndex].name}</p>
                                        <p className="text-sm text-[var(--text-muted)]">{reviews[currentIndex].timeAgo}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                                    <span className="px-3 py-1 bg-[var(--cream)] rounded-full">{reviews[currentIndex].orderType}</span>
                                    <span className="px-3 py-1 bg-[var(--chutney)]/10 text-[var(--chutney)] rounded-full font-medium">{reviews[currentIndex].priceRange}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-[var(--saffron)] w-8"
                                    : "bg-[var(--border)] hover:bg-[var(--text-muted)]"
                                    }`}
                                aria-label={`Go to review ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Google Rating Badge */}
                <div className="flex items-center justify-center mt-8">
                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm border border-[var(--border)]">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-[var(--text-dark)]">4.3</span>
                            <Star size={16} className="fill-[var(--turmeric)] text-[var(--turmeric)]" />
                        </div>
                        <span className="text-sm text-[var(--text-muted)]">Google Reviews</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
