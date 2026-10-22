import React, { useState } from 'react';
import { ArrowRight, Phone, ShieldCheck, CheckCircle2, Clock, MapPin, Truck, Layers } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from '../common/Container';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-amber-400 text-xs font-semibold tracking-wide shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Professional Packers &amp; Movers Relocation Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Moving Made Simple.{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500">
                Every Step of the Way.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Whether relocating your home across town or transitioning a corporate office to a new
              city, Shiftora delivers dependable moving services, multi-layer protective packing,
              upfront transparent quotes, and dedicated transit coordination.
            </p>

            {/* Call to Actions */}
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
                icon={<Phone className="w-4 h-4 text-amber-600" />}
                iconPosition="left"
                id="hero-secondary-call-cta"
              >
                Call: {siteConfig.contact.phoneDisplay}
              </Button>
            </div>

            {/* Honest Highlights (No fabricated statistics) */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Multi-Layer Packing</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dedicated Move Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Relocation Photography & Details Card */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800/60 shadow-2xl backdrop-blur-xs">
              {/* Photo Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                {!imgError ? (
                  <img
                    src="/shiftora-hero-truck.jpg"
                    alt="Shiftora moving truck and packed relocation cartons ready for residential transport"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-center">
                    <Truck className="w-16 h-16 text-amber-500 mb-3" />
                    <p className="text-sm font-bold text-white">Shiftora Relocation Logistics</p>
                    <p className="text-xs text-slate-400 mt-1">Careful Packing &bull; Planned Transit</p>
                  </div>
                )}

                {/* Overlaid Live Operational Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-white">Active Relocation Fleet</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-amber-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                  Standardized 4-Layer Care
                </div>
              </div>

              {/* Lower Card Info Strip */}
              <div className="p-5 bg-slate-900/95 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    Covering 8 Major Metro Hubs
                  </span>
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {siteConfig.contact.operatingHours}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                    <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Itemized Inventory Inspection</span>
                  </div>
                  <a
                    href="#services"
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    View Services &rarr;
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
