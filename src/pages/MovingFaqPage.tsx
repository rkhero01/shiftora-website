import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { siteConfig } from '../config/siteConfig';

interface FaqItem {
  id: string;
  category: 'Booking & Quotes' | 'Packing & Transit' | 'Services' | 'Support';
  question: string;
  answer: string;
  highlights?: string[];
  relatedLink?: {
    label: string;
    to: string;
  };
}

const faqItems: FaqItem[] = [
  {
    id: 'how-do-i-book-a-move',
    category: 'Booking & Quotes',
    question: 'How do I book a move with Toter?',
    answer:
      'Booking a move with TOTER Packers & Movers is straightforward. Simply reach out to us via our online quote form, phone call, or WhatsApp with your origin, destination, preferred moving date, and basic inventory details. Our relocation coordinator will review your requirements, provide a clear written quotation, and confirm your moving schedule and crew allocation once you approve the estimate.',
    highlights: [
      'Share your origin, destination, and tentative moving date',
      'Complete a quick inventory discussion or pre-move survey',
      'Review and approve your transparent written quotation to lock in your slot',
    ],
    relatedLink: {
      label: 'Request a Moving Quote',
      to: '/#get-quote',
    },
  },
  {
    id: 'how-can-i-get-a-moving-quotation',
    category: 'Booking & Quotes',
    question: 'How can I get a moving quotation?',
    answer:
      `You can request a moving quotation by filling out the "Get Quote" form on our homepage, calling us directly at ${siteConfig.contact.phoneDisplay}, or messaging us on WhatsApp. For larger homes, offices, or industrial moves, our coordinator can guide you through an itemized inventory review so your estimate accurately reflects the packing materials, crew size, and vehicle capacity required.`,
    highlights: [
      'Online quote form available 24/7 on our website',
      `Direct telephone consultation at ${siteConfig.contact.phoneDisplay}`,
      'Instant WhatsApp support for sharing room or item lists',
    ],
    relatedLink: {
      label: 'Explore Door-to-Door Relocation',
      to: '/services/door-to-door-relocation',
    },
  },
  {
    id: 'how-early-should-i-book',
    category: 'Booking & Quotes',
    question: 'How early should I book?',
    answer:
      'For local within-city household moves, we recommend booking at least 3 to 7 days in advance. For inter-city moves, corporate/office relocations, weekend or month-end dates, and international shipments, booking 1 to 3 weeks ahead helps ensure your preferred moving slot, society permissions, and dedicated container vehicle are reserved without rush.',
    highlights: [
      'Local moves: 3–7 days prior notice recommended',
      'Inter-city & office moves: 1–2 weeks prior notice recommended',
      'International relocations: 2–4 weeks prior notice for documentation and crating',
    ],
  },
  {
    id: 'do-you-provide-packing-materials',
    category: 'Packing & Transit',
    question: 'Do you provide packing materials?',
    answer:
      'Yes. When you book full packing service with TOTER Packers & Movers, our crew arrives on moving day equipped with all required professional packing supplies—including multi-ply corrugated boxes, bubble wrap, corrugated rolls, stretch film, edge guards, and packing tape—tailored to your household or office inventory.',
    highlights: [
      'Heavy-duty corrugated cartons for books, kitchenware, and clothes',
      'Bubble wrap, foam sheets, and corrugated rolls for fragile items and appliances',
      'Stretch film and protective padding for furniture and mattresses',
    ],
    relatedLink: {
      label: 'View Residential Relocation Details',
      to: '/services/residential-relocation',
    },
  },
  {
    id: 'how-are-household-goods-packed',
    category: 'Packing & Transit',
    question: 'How are household goods packed?',
    answer:
      'Our trained packing crew follows an item-specific multi-layer protection process. Delicate glassware and crockery are individually wrapped and placed in cushioned cartons; large appliances and wooden furniture are wrapped with protective cushioning, corrugated sheets, and stretch film; modular beds and dining tables are carefully dismantled at origin and reassembled at your destination.',
    highlights: [
      'Room-by-room systematic packing and clear box labeling',
      'Furniture dismantling and reassembly for beds, wardrobes, and tables',
      'Special cushioning for LED TVs, mirrors, glass tops, and kitchen appliances',
    ],
    relatedLink: {
      label: 'Learn About Residential Relocation',
      to: '/services/residential-relocation',
    },
  },
  {
    id: 'can-i-track-my-shipment',
    category: 'Packing & Transit',
    question: 'Can I track my shipment?',
    answer:
      'Yes. Throughout your move, you are assigned a move coordinator who provides milestone updates from dispatch to arrival. For inter-city road freight, vehicle carrier transport, and air or sea cargo shipments, our operations desk keeps you informed of transit checkpoints and expected delivery schedules.',
    highlights: [
      'Direct move supervisor contact throughout loading, transit, and delivery',
      'Proactive milestone updates via phone and WhatsApp',
      'Checkpoint and airwaybill/consignment coordination for freight shipments',
    ],
    relatedLink: {
      label: 'Explore Road Freight Services',
      to: '/services/road-freight',
    },
  },
  {
    id: 'do-you-transport-cars-and-bikes',
    category: 'Services',
    question: 'Do you transport cars and bikes?',
    answer:
      'Yes. TOTER Packers & Movers provides dedicated vehicle transportation across India. Cars are loaded onto specialized hydraulic car carrier trailers using wheel locks and a pre-dispatch condition inspection checklist, while two-wheelers (bikes and scooters) are securely wrapped with protective padding to prevent scratches during transit.',
    highlights: [
      'Enclosed and standard car carrier trailers with hydraulic ramps',
      'Pre-loading vehicle condition checklist and wheel tie-down restraints',
      'Safe two-wheeler crating and protective multi-layer wrapping',
    ],
    relatedLink: {
      label: 'View Car Shifting by Car Carrier',
      to: '/services/car-shifting-by-car-carrier',
    },
  },
  {
    id: 'do-you-provide-office-relocation',
    category: 'Services',
    question: 'Do you provide office relocation?',
    answer:
      'Yes. We offer both structured Office Relocation and Corporate Shifting Services. Our commercial moving crews handle IT equipment, desktop monitors, server racks, modular workstations, conference room furniture, and archived files with serialized desk tagging and flexible weekend or after-hours execution to minimize business downtime.',
    highlights: [
      'Anti-static and cushioned packing for computers, monitors, and servers',
      'Department-wise and desk-wise labeling for fast setup at the new office',
      'Weekend and off-peak scheduling to avoid disrupting business operations',
    ],
    relatedLink: {
      label: 'Explore Office Relocation',
      to: '/services/office-relocation',
    },
  },
  {
    id: 'do-you-offer-international-moving',
    category: 'Services',
    question: 'Do you offer international moving?',
    answer:
      'Yes. TOTER provides International Relocation as well as Air Freight and Sea Freight solutions for overseas moves. We assist with export-grade packing (including ISPM-15 heat-treated wooden crating where required), export documentation guidance, customs clearance coordination, and Full Container Load (FCL), Less than Container Load (LCL), or air cargo shipping.',
    highlights: [
      'Export-grade multi-layer packing and ISPM-15 wooden crating',
      'Air freight for urgent shipments and sea freight (FCL/LCL) for full households',
      'End-to-end customs documentation advisory and destination delivery coordination',
    ],
    relatedLink: {
      label: 'Explore International Relocation',
      to: '/services/international-relocation',
    },
  },
  {
    id: 'what-happens-if-my-moving-date-changes',
    category: 'Booking & Quotes',
    question: 'What happens if my moving date changes?',
    answer:
      'We understand that property handovers, lease dates, or travel schedules can change. If you need to reschedule your moving date, please inform our coordination desk by phone or WhatsApp as early as possible. Our team will work with you to adjust your crew and vehicle allocation to your new preferred date subject to schedule availability.',
    highlights: [
      'Notify our support desk as soon as your revised move date is known',
      'Flexible rescheduling support based on crew and truck availability',
      'Review our Terms of Service for booking and scheduling guidelines',
    ],
    relatedLink: {
      label: 'Read Terms of Service',
      to: '/terms-of-service',
    },
  },
  {
    id: 'how-can-i-contact-toter',
    category: 'Support',
    question: 'How can I contact Toter?',
    answer:
      `You can reach TOTER Packers & Movers seven days a week (${siteConfig.contact.operatingHours}) by calling ${siteConfig.contact.phoneDisplay}, chatting with us on WhatsApp, emailing ${siteConfig.contact.email}, or visiting our office at ${siteConfig.contact.addressSummary}.`,
    highlights: [
      `Phone: ${siteConfig.contact.phoneDisplay}`,
      `Email: ${siteConfig.contact.email}`,
      `Hours: ${siteConfig.contact.operatingHours}`,
      `Office: ${siteConfig.contact.addressSummary}`,
    ],
  },
];

export const MovingFaqPage: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(faqItems.map((item) => [item.id, true]))
  );

  useEffect(() => {
    const title = 'Moving FAQ — Frequently Asked Questions | TOTER Packers & Movers';
    const description =
      'Find answers to common questions about booking a move with TOTER Packers & Movers, getting quotations, packing materials, car transport, office relocation, and international moving.';

    document.title = title;
    if (typeof document.querySelector === 'function') {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const whatsappUrl =
    'https://wa.me/917428614678?text=' +
    encodeURIComponent('Hi Toter, I have a question about planning my upcoming move.');

  return (
    <main className="flex-1 bg-[#081426] text-white">
      {/* ── Hero / Page Heading & Breadcrumb ──────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-white/10 bg-gradient-to-b from-[#0b1b33] to-[#081426]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF641A]/10 rounded-full blur-3xl pointer-events-none" />
        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-[#FF641A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              </li>
              <li className="text-[#FF641A] font-semibold" aria-current="page">
                Moving FAQ
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF641A]/15 border border-[#FF641A]/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF641A] mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              Help Center &amp; Moving Guide
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Moving <span className="text-[#FF641A]">FAQ</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Clear, practical answers to the most common questions about booking your relocation, getting a moving estimate, packing standards, vehicle transport, office shifting, and international moving with <strong className="text-white">{siteConfig.legalEntityName}</strong>.
            </p>
          </div>
        </Container>
      </section>

      {/* ── FAQ Content & Quick Jump Sidebar ──────────────────────── */}
      <section className="py-16 lg:py-20 border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Quick Links */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-6">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#FF641A] mb-3">
                    All 11 Questions
                  </h2>
                  <ul className="space-y-1.5 text-sm">
                    {faqItems.map((item, index) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setOpenIds((prev) => ({ ...prev, [item.id]: true }))}
                          className="flex items-start gap-2.5 py-1.5 px-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span className="text-xs font-bold text-[#FF641A] mt-0.5">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="leading-snug">{item.question}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3">
                    Legal &amp; Policy Pages
                  </h3>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link
                      to="/privacy-policy"
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-[#FF641A]/15 border border-white/10 hover:border-[#FF641A]/35 text-white/80 hover:text-white transition-all"
                    >
                      <span>Privacy Policy</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF641A]" />
                    </Link>
                    <Link
                      to="/terms-of-service"
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-[#FF641A]/15 border border-white/10 hover:border-[#FF641A]/35 text-white/80 hover:text-white transition-all"
                    >
                      <span>Terms of Service</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF641A]" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* FAQ Accordion Cards */}
            <div className="lg:col-span-8 space-y-5">
              {faqItems.map((item, index) => {
                const isOpen = !!openIds[item.id];
                return (
                  <article
                    key={item.id}
                    id={item.id}
                    className="scroll-mt-28 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#FF641A]/35 transition-colors overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between gap-4 p-6 sm:p-7 text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FF641A]/15 border border-[#FF641A]/30 text-sm font-black text-[#FF641A] shrink-0 mt-0.5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#4F8FF7] mb-1">
                            {item.category}
                          </span>
                          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                            {item.question}
                          </h2>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#FF641A] shrink-0 mt-1 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 border-t border-white/5">
                        <p className="text-sm sm:text-base text-white/75 leading-relaxed mt-4">
                          {item.answer}
                        </p>

                        {item.highlights && item.highlights.length > 0 && (
                          <ul className="mt-4 space-y-2 bg-[#060e1b]/70 border border-white/8 rounded-xl p-4">
                            {item.highlights.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                                <CheckCircle2 className="w-4 h-4 text-[#FF641A] shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {item.relatedLink && (
                          <div className="mt-4">
                            <Link
                              to={item.relatedLink.to}
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FF641A] hover:text-orange-400 transition-colors"
                            >
                              <span>{item.relatedLink.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}

              {/* Direct Support Box */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0b1b33] to-[#060e1b] border border-[#FF641A]/30 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                  Still Have a Question About Your Move?
                </h2>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                  Reach out to our relocation support desk directly—we will gladly help you plan your packing, vehicle transport, or freight shipment.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <a
                    href={siteConfig.contact.phoneRaw}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#FF641A] shrink-0" />
                    <div>
                      <div className="text-xs text-white/50">Phone</div>
                      <div className="font-semibold text-white">{siteConfig.contact.phoneDisplay}</div>
                    </div>
                  </a>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#FF641A] shrink-0" />
                    <div>
                      <div className="text-xs text-white/50">Email</div>
                      <div className="font-semibold text-white break-all">{siteConfig.contact.email}</div>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <MapPin className="w-4 h-4 text-[#FF641A] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-white/50">Office Address</div>
                      <div className="text-white/85 text-xs sm:text-sm">{siteConfig.contact.addressSummary}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-[#FF641A] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-white/50">Operating Hours</div>
                      <div className="text-white/85 text-xs sm:text-sm">{siteConfig.contact.operatingHours}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Internal Links to All 10 Relocation Services ──────────── */}
      <section className="py-14 bg-[#060e1b] border-b border-white/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF641A]">
              Complete Service Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore All 10 TOTER Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {siteConfig.services.map((service) => (
              <Link
                key={service.id}
                to={service.href ?? `/services/${service.id}`}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-[#FF641A]/15 border border-white/10 hover:border-[#FF641A]/40 text-xs sm:text-sm font-semibold text-white/85 hover:text-white transition-all"
              >
                <span>{service.title}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF641A] shrink-0" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Request Quote / Contact CTA ───────────────────────────── */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF641A]/20 via-[#081426] to-[#4F8FF7]/10 border border-white/10 p-8 sm:p-12 lg:p-14 text-center shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Ready to Book Your Move with <span className="text-[#FF641A]">TOTER</span>?
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-8 leading-relaxed">
                Get a clear, no-obligation moving quotation from our team today. Call us at{' '}
                <a href={siteConfig.contact.phoneRaw} className="text-[#FF641A] font-semibold hover:underline">
                  {siteConfig.contact.phoneDisplay}
                </a>{' '}
                or request your estimate online.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={siteConfig.contact.phoneRaw}
                  className="inline-flex items-center gap-2 bg-[#FF641A] hover:bg-orange-500 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg shadow-lg transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  Call Now: {siteConfig.contact.phoneDisplay}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
                <Link
                  to="/#get-quote"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg transition-all duration-200"
                >
                  Online Quote Form &rarr;
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default MovingFaqPage;
