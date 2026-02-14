import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="py-14 bg-[var(--cream)] border-t border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-[var(--border)]">
                                <Image
                                    src="/images/logo.jpg"
                                    alt="BP Street Logo"
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-[var(--text-dark)] text-lg leading-none">The BP Street</p>
                                <p className="text-xs text-[var(--saffron)] font-medium">Street Food • Est. 2024</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">
                            Authentic North Indian street food made with love and served hot! 🔥
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-[var(--text-dark)] mb-4">Explore</h4>
                        <ul className="space-y-2">
                            <li><Link href="/menu" className="text-sm text-[var(--text-muted)] hover:text-[var(--saffron)] transition-colors">Our Menu</Link></li>
                            <li><Link href="/offers" className="text-sm text-[var(--text-muted)] hover:text-[var(--saffron)] transition-colors">Today&apos;s Deals</Link></li>
                            <li><Link href="/track" className="text-sm text-[var(--text-muted)] hover:text-[var(--saffron)] transition-colors">Track Order</Link></li>
                            <li><Link href="/account" className="text-sm text-[var(--text-muted)] hover:text-[var(--saffron)] transition-colors">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-[var(--text-dark)] mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="text-[var(--saffron)] mt-0.5 shrink-0" /> K-3, Sector 29, Noida, Uttar Pradesh 201303
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-[var(--saffron)]" /> +91 96433 00462
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-[var(--saffron)]" /> hello@bpstreet.in
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-bold text-[var(--text-dark)] mb-4">Opening Hours</h4>
                        <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                            <li className="flex items-center gap-2">
                                <Clock size={16} className="text-[var(--saffron)]" /> Mon-Fri: 11am - 11pm
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock size={16} className="text-[var(--saffron)]" /> Sat-Sun: 10am - 12am
                            </li>
                        </ul>
                        <div className="mt-4">
                            <p className="text-xs text-[var(--chutney)] font-semibold bg-[var(--chutney)]/10 inline-flex items-center gap-1 px-3 py-1.5 rounded-full">
                                🟢 Currently Open
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--text-muted)]">
                        © 2024 The BP Street. Made with ❤️ in Noida
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="https://www.instagram.com/thebpstreet/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--saffron)] hover:border-[var(--saffron)] transition-colors">
                            <Instagram size={18} />
                        </a>
                        <a href="https://www.facebook.com/thebpstreet/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--saffron)] hover:border-[var(--saffron)] transition-colors">
                            <Facebook size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
