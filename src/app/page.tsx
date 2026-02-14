import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PopularItems } from "@/components/home/PopularItems";
import { Reviews } from "@/components/home/Reviews";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Flame, Truck, ChefHat, Smartphone, Sparkles, Timer } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryCards />
      <PopularItems />
      <Reviews />

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-dark)] mb-2">
              Why People Love Us
            </h2>
            <p className="text-[var(--text-muted)]">We don&apos;t just serve food, we serve happiness!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Flame className="text-[var(--saffron)]" size={28} />}
              title="Made Fresh Daily"
              desc="Every dish is prepared fresh when you order—no leftovers, ever!"
            />
            <FeatureCard
              icon={<Truck className="text-[var(--chutney)]" size={28} />}
              title="Lightning Fast Delivery"
              desc="Average delivery time under 30 minutes—your food arrives hot!"
            />
            <FeatureCard
              icon={<ChefHat className="text-[var(--chai)]" size={28} />}
              title="Secret Family Recipes"
              desc="Authentic recipes passed down for generations. Taste the tradition!"
            />
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="py-16 bg-gradient-to-br from-[var(--saffron)] to-[var(--spice)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left max-w-lg">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4 backdrop-blur">
                <Smartphone size={16} /> Coming Soon
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Order faster with our app!
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Get exclusive app-only deals, faster checkout, and real-time order tracking. Plus, ₹50 off your first app order!
              </p>
              <div className="flex gap-3 justify-center lg:justify-start">
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-[var(--text-dark)] font-bold rounded-full hover:bg-[var(--cream)] transition-colors shadow-lg">
                  <AppleIcon /> App Store
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-[var(--text-dark)] font-bold rounded-full hover:bg-[var(--cream)] transition-colors shadow-lg">
                  <PlayIcon /> Play Store
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="w-56 h-96 bg-white/10 backdrop-blur-sm rounded-[3rem] border-4 border-white/30 flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <Sparkles size={60} className="mx-auto mb-3 text-white/80" />
                  <p className="text-sm text-white/80">App Preview</p>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[var(--turmeric)] rounded-2xl flex items-center justify-center shadow-lg">
                <Timer size={28} className="text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Flame size={24} className="text-[var(--saffron)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="food-card p-7 text-center hover:shadow-lg transition-all group">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--cream)] flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-[var(--text-dark)] text-lg mb-2">{title}</h3>
      <p className="text-[var(--text-muted)]">{desc}</p>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}
