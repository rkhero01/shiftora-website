import React from 'react';
import { ArrowRight, Phone, ShieldCheck, CheckCircle2, Clock, MapPin, Layers } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { getAssetUrl } from '../../utils/assetUrl';
import { useVisitorCity } from '../../hooks/useVisitorCity';

export const HeroSection: React.FC = () => {
  const heroBgUrl = getAssetUrl('/images/toter-international-moving-day.png');
  const { locationLabel, isLoading } = useVisitorCity();

  return (
    <section
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center overflow-hidden text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${heroBgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="Hero – TOTER Packers & Movers"
    >
      {/* Full-width, full-height background image with subtle dark navy overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgUrl}
          alt="TOTER Packers & Movers International Moving Truck and Boxes"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          loading="eager"
        />
        {/* Subtle dark navy overlay so hero text remains crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#081426]/90 via-[#081426]/70 to-[#081426]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/80 via-[#081426]/25 to-[#081426]/40" />
      </div>

      {/* Decorative ambient glow dots */}
      <div className="absolute top-12 left-[55%] w-72 h-72 bg-[#FF641A]/12 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-48 bg-[#4F8FF7]/8 rounded-full blur-3xl pointer-events-none z-0" />

      <Container className="relative z-10 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Badge */}
            <div
              className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-3.5 py-1.5 rounded-full bg-[#081426]/75 backdrop-blur-md border border-white/20 text-orange-300 text-xs sm:text-sm font-bold tracking-wide shadow-lg max-w-full"
              aria-live="polite"
            >
              <ShieldCheck className="w-4 h-4 text-[#FF641A] shrink-0" />
              <span>
                TOTER Packers &amp; Movers &middot;{' '}
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5 text-white/80 animate-pulse" data-testid="location-loading">
                    Locating city...
                  </span>
                ) : (
                  <span className="text-orange-300" data-testid="location-label">
                    {locationLabel}
                  </span>
                )}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
              Moving Beyond{' '}
              <span className="text-[#FF641A]">Borders,</span>
              <span className="block mt-1.5 text-white/95">Delivering With Care.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-white/90 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow">
              Professional packing, moving and logistics solutions for homes and businesses.
              Whether relocating across town, interstate, or worldwide, TOTER Packers &amp; Movers
              delivers standardized multi-layer protection, transparent pricing, and dedicated
              door-to-door coordination.
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
            <div className="pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'Multi-Layer Packing',
                'Zero Hidden Fees',
                'Dedicated Move Support',
              ].map((point) => (
                <div key={point} className="flex items-center justify-center lg:justify-start gap-2.5 text-xs sm:text-sm font-medium text-white/85">
                  <CheckCircle2 className="w-4 h-4 text-[#FF641A] shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/20 bg-[#081426]/65 backdrop-blur-md shadow-2xl">
              {/* Card image strip */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={heroBgUrl}
                  alt="TOTER Packers & Movers fleet and packed relocation boxes"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/85 via-transparent to-transparent" />

                {/* Live badge */}
                <div className="absolute top-3 left-3 bg-[#081426]/85 backdrop-blur-md border border-white/15 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">Active Relocation Fleet</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-[#FF641A] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                  Standardized 4-Layer Care
                </div>
              </div>

              {/* Card Info Strip */}
              <div className="p-5 bg-[#081426]/90 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/75 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF641A]" />
                    PAN India &amp; International
                  </span>
                  <span className="text-white/75 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF641A]" />
                    {siteConfig.contact.operatingHours}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-white/85">
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
