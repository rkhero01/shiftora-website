import React from 'react';
import { ArrowRight, Phone, ShieldCheck, CheckCircle2, Clock, MapPin, Layers } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from '../common/Container';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden text-white"
      aria-label="Hero – Shiftora Packers and Movers"
    >
      {/* Full-width background image with layered dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/shiftora-hero-truck.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          loading="eager"
        />
        {/* Multi-layer overlay: navy base + subtle warm bottom glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#081426]/90 via-[#081426]/75 to-[#081426]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/80 via-transparent to-[#081426]/30" />
      </div>

      {/* Decorative ambient glow dots */}
      <div className="absolute top-12 left-[55%] w-72 h-72 bg-[#FF641A]/12 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-48 bg-[#4F8FF7]/8 rounded-full blur-3xl pointer-events-none z-0" />

      <Container className="relative z-10 pt-14 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-orange-300 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#FF641A] shrink-0" />
              <span>Professional Packers &amp; Movers · Delhi NCR &amp; PAN India</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Moving Made{' '}
              <span className="text-[#FF641A]">Simple.</span>
              <span className="block mt-1 text-white/90">Every Step of the Way.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Whether relocating your home across town or transitioning a corporate office to a new
              city, Shiftora delivers dependable moving services, multi-layer protective packing,
              upfront transparent quotes, and dedicated transit coordination.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                href="#get-quote"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                id="hero-primary-quote-cta"
              >
                Get a Free Quote
              </Button>

              <Button
                href={siteConfig.contact.phoneRaw}
                variant="white"
                size="lg"
                icon={<Phone className="w-4 h-4 text-[#FF641A]" />}
                iconPosition="left"
                id="hero-secondary-call-cta"
              >
                Call: {siteConfig.contact.phoneDisplay}
              </Button>
            </div>

            {/* Key Highlights */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'Multi-Layer Packing',
                'Zero Hidden Fees',
                'Dedicated Move Support',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2.5 text-xs text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-[#FF641A] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-white/8 backdrop-blur-md shadow-2xl">
              {/* Card image strip */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/loaded-moving-truck.jpg"
                  alt="Shiftora relocation – packed cartons and furniture loaded in a transport truck"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/80 via-transparent to-transparent" />

                {/* Live badge */}
                <div className="absolute top-3 left-3 bg-[#081426]/85 backdrop-blur-md border border-white/15 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">Active Relocation Fleet</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-[#FF641A]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                  Standardized 4-Layer Care
                </div>
              </div>

              {/* Card Info Strip */}
              <div className="p-5 bg-[#081426]/90 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF641A]" />
                    Covering 8 Major Metro Hubs
                  </span>
                  <span className="text-white/60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF641A]" />
                    {siteConfig.contact.operatingHours}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                    <Layers className="w-4 h-4 text-[#4F8FF7] shrink-0" />
                    <span>Itemized Inventory Inspection</span>
                  </div>
                  <a
                    href="#services"
                    className="text-xs font-semibold text-[#FF641A] hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    View Services →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
