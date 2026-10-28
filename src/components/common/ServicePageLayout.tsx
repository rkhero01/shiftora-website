import React from 'react';
import { ArrowRight, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Container } from './Container';
import { siteConfig } from '../../config/siteConfig';

/* ── Types ──────────────────────────────────────────────────────── */
export interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ServicePageLayoutProps {
  /** Browser tab title */
  pageTitle: string;
  /** Pill label above the h1 */
  categoryLabel: string;
  /** Page h1 */
  heading: string;
  /** Orange-highlighted portion of the heading (appended after heading) */
  headingAccent?: string;
  /** Short supporting paragraph */
  subheading: string;
  /** Real photo from public/ – must actually exist */
  heroImage: string;
  heroImageAlt: string;
  /** Bullet highlights shown beside the hero image */
  highlights: string[];
  /** 3 or 6 feature cards */
  features: ServiceFeature[];
  /** 3-5 numbered process steps */
  processSteps: ProcessStep[];
  /** WhatsApp message pre-fill text */
  whatsappMessage: string;
  /** Optional second image below features */
  galleryImage?: string;
  galleryImageAlt?: string;
}

/* ── Component ──────────────────────────────────────────────────── */
export const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  pageTitle,
  categoryLabel,
  heading,
  headingAccent,
  subheading,
  heroImage,
  heroImageAlt,
  highlights,
  features,
  processSteps,
  whatsappMessage,
  galleryImage,
  galleryImageAlt,
}) => {
  React.useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const whatsappUrl =
    'https://wa.me/917428614678?text=' + encodeURIComponent(whatsappMessage);

  return (
    <main className="flex-1 bg-[#081426] text-white">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-14 pb-20 lg:pt-18 lg:pb-28 border-b border-white/8">
        {/* bg image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081426]/92 via-[#081426]/78 to-[#081426]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/80 via-transparent to-transparent" />
        </div>
        {/* ambient glow */}
        <div className="absolute top-10 right-1/3 w-80 h-80 bg-[#FF641A]/10 rounded-full blur-3xl pointer-events-none z-0" />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            {/* category pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF641A]/15 border border-[#FF641A]/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF641A] mb-5">
              {categoryLabel}
            </span>

            {/* h1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
              {heading}
              {headingAccent && (
                <span className="text-[#FF641A]"> {headingAccent}</span>
              )}
            </h1>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">
              {subheading}
            </p>

            {/* Highlights */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5 mb-10">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-white/75">
                  <CheckCircle2 className="w-4 h-4 text-[#FF641A] shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#get-quote"
                className="inline-flex items-center justify-center gap-2 bg-[#FF641A] hover:bg-orange-500 text-white font-semibold text-base px-7 py-3.5 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF641A] focus:ring-offset-2 focus:ring-offset-[#081426]"
                id="service-hero-quote-cta"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.contact.phoneRaw}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/18 border border-white/20 text-white font-semibold text-base px-7 py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
                id="service-hero-call-cta"
              >
                <Phone className="w-4 h-4 text-[#FF641A]" />
                {siteConfig.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/8">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#FF641A] mb-3">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Service <span className="text-[#4F8FF7]">Features</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="group flex flex-col gap-4 bg-white/5 hover:bg-white/9 border border-white/10 hover:border-[#FF641A]/35 rounded-2xl p-7 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF641A]/12 border border-[#FF641A]/20 flex items-center justify-center text-[#FF641A] shrink-0 group-hover:bg-[#FF641A]/20 transition-colors">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">{feat.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Optional Gallery Image ──────────────────────────────────── */}
      {galleryImage && (
        <section className="py-16 border-b border-white/8">
          <Container>
            <figure className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                src={galleryImage}
                alt={galleryImageAlt ?? ''}
                className="w-full max-h-[480px] object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Container>
        </section>
      )}

      {/* ── Process Steps ──────────────────────────────────────────── */}
      <section className="py-20 border-b border-white/8">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#FF641A] mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our <span className="text-[#4F8FF7]">Process</span>
            </h2>
          </div>
          <div className="relative">
            {/* connecting line – desktop only */}
            <div className="hidden lg:block absolute top-8 left-[calc(100%/10)] right-[calc(100%/10)] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#FF641A]/12 border-2 border-[#FF641A]/35 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-[#FF641A]">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section id="get-quote" className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF641A]/20 via-[#081426] to-[#4F8FF7]/10 border border-white/10 p-10 lg:p-16 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF641A]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#4F8FF7]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Ready to Move with <span className="text-[#FF641A]">Shiftora</span>?
              </h2>
              <p className="text-white/60 text-base mb-10 max-w-xl mx-auto leading-relaxed">
                Get a transparent, no-obligation quote. Our team will call you within 30 minutes.
                Phone: <a href={siteConfig.contact.phoneRaw} className="text-[#FF641A] font-semibold hover:underline">{siteConfig.contact.phoneDisplay}</a>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={siteConfig.contact.phoneRaw}
                  className="inline-flex items-center gap-2 bg-[#FF641A] hover:bg-orange-500 text-white font-semibold text-base px-8 py-3.5 rounded-lg shadow-lg transition-all duration-200"
                  id="service-cta-call-btn"
                >
                  <Phone className="w-4 h-4" />
                  Call Now: {siteConfig.contact.phoneDisplay}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base px-8 py-3.5 rounded-lg shadow-lg transition-all duration-200"
                  id="service-cta-whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};
