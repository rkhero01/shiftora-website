import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  ChevronRight,
  Truck,
  ClipboardList,
  Package,
  UserCheck,
  CreditCard,
  Clock,
  ShieldAlert,
  Scale,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { siteConfig } from '../config/siteConfig';

interface TermsSection {
  id: string;
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  paragraphs: string[];
  bullets: string[];
  ownerReviewNote?: string;
}

const termsSections: TermsSection[] = [
  {
    id: 'acceptance-of-terms',
    number: '01',
    icon: FileCheck,
    title: 'Acceptance of Terms',
    paragraphs: [
      'By accessing the TOTER Packers & Movers website, requesting a moving estimate, or booking relocation, packing, vehicle transport, or freight services with TOTER Packers & Movers ("TOTER", "we", "our", or "us"), you agree to be bound by these Terms of Service and any written quotation or consignment terms agreed at the time of booking.',
      'If you are booking services on behalf of a company, business, or household member, you confirm that you have the authority to accept these terms and coordinate the relocation on their behalf.',
    ],
    bullets: [
      'Applies to all website enquiries, pre-move surveys, and booked relocation or freight jobs',
      'Written booking confirmations or consignment notes issued for a specific move supplement these general terms',
    ],
  },
  {
    id: 'moving-and-transportation-services',
    number: '02',
    icon: Truck,
    title: 'Moving and Transportation Services',
    paragraphs: [
      'TOTER Packers & Movers provides residential relocation, corporate shifting, office relocation, door-to-door relocation, international relocation coordination, car shifting by car carrier, industrial relocation, and road, air, and sea freight services.',
      'All services are subject to route availability, vehicle access at origin and destination, compliance with transport regulations, and safe handling conditions.',
    ],
    bullets: [
      'Service scope (packing, loading, transport, unloading, unpacking) is defined in your written quotation',
      'Certain routes or specialized cargo movements may be executed in coordination with vetted partner carriers or freight operators',
      'Hazardous, flammable, illegal, perishable, or prohibited goods are strictly excluded from transport',
    ],
  },
  {
    id: 'booking-and-quotation-conditions',
    number: '03',
    icon: ClipboardList,
    title: 'Booking and Quotation Conditions',
    paragraphs: [
      'Moving estimates and quotations are prepared based on the inventory list, origin/destination locations, floor levels, elevator availability, carry distance, and preferred moving dates shared by the customer during the enquiry or survey.',
      'Any material change in the volume of goods, addition of unscheduled items, change in pickup/delivery address, restricted truck access requiring shuttle vehicles, or stair-carry requirements not disclosed at the time of quotation may result in a revised estimate prior to loading.',
    ],
    bullets: [
      'Quotations remain valid for the period stated on the written estimate provided to the customer',
      'Bookings are confirmed upon customer approval of the written quotation and fulfillment of agreed booking confirmation steps',
      'Additional services requested on moving day (such as extra packing items, carpentry, or appliance technician support) are billed as agreed before execution',
    ],
  },
  {
    id: 'packing-and-handling-responsibilities',
    number: '04',
    icon: Package,
    title: 'Packing and Handling Responsibilities',
    paragraphs: [
      'When professional packing is included in your service scope, our crew uses appropriate packing materials—such as corrugated cartons, bubble wrap, corrugated rolls, stretch film, and protective wrapping—suited to the nature of the goods.',
      'For customer-packed boxes or sealed cartons packed without supervision by TOTER crew members, TOTER can only verify external carton condition and cannot inspect or verify the internal cushioning or contents.',
    ],
    bullets: [
      'Fragile glassware, electronics, artwork, and marble/glass furniture tops should be declared prior to packing',
      'Appliances (such as refrigerators, washing machines, ACs, geysers, and water purifiers) must be drained, defrosted, and disconnected prior to packing unless technician dismantling is specifically arranged',
      'Internal mechanical or electronic functioning of pre-owned appliances cannot be tested by packing staff',
    ],
  },
  {
    id: 'customer-responsibilities',
    number: '05',
    icon: UserCheck,
    title: 'Customer Responsibilities',
    paragraphs: [
      'To ensure a smooth, timely, and compliant move, the customer (or an authorized representative) must be present during packing, loading, and unloading to verify the inventory checklist and sign dispatch/delivery documents.',
    ],
    bullets: [
      'Obtain necessary society, apartment management, gate pass, lift usage, or parking permissions at both origin and destination',
      'Retain personal custody of cash, jewelry, bullion, bank documents, passports, property deeds, laptops, and irreplaceable personal valuables—these items must not be handed over in moving cartons',
      'Provide accurate declaration lists or statutory documents required for inter-state check-posts, corporate GST movement, or international customs clearance',
      'Inspect delivered cartons and items at the time of unloading and note any visible discrepancy on the delivery acknowledgment sheet',
    ],
  },
  {
    id: 'payment-and-cancellation-conditions',
    number: '06',
    icon: CreditCard,
    title: 'Payment and Cancellation Conditions',
    paragraphs: [
      'Payment milestones, accepted payment methods, deposit requirements, and balance settlement terms are communicated in the written quotation or booking confirmation issued for your move.',
      'If you need to reschedule or cancel a confirmed booking, please notify our coordination desk as early as possible by phone or email so crew allocation and vehicle scheduling can be adjusted.',
    ],
    bullets: [
      'Applicable taxes, toll charges, octroi/green tax, or port/customs duties are specified in the quotation or billed as actuals where applicable',
      'Rescheduling is accommodated subject to crew and vehicle availability on the revised date',
    ],
    ownerReviewNote:
      'Owner Review Note: Specific advance deposit percentages, final payment timing (prior to dispatch vs. upon arrival), cancellation notice windows, and refund/rescheduling fee schedules should be confirmed by management according to your official billing policy.',
  },
  {
    id: 'delays-and-unforeseen-circumstances',
    number: '07',
    icon: Clock,
    title: 'Delays and Unforeseen Circumstances',
    paragraphs: [
      'TOTER Packers & Movers plans transit schedules carefully and communicates estimated delivery windows based on normal highway, rail, air, or sea operating conditions.',
      'Transit timelines are estimates and may be affected by factors outside reasonable operational control, including severe weather, highway blockades, traffic restrictions, no-entry hours for heavy vehicles, mechanical breakdowns, strikes, port/airline congestion, or customs/check-post inspections.',
    ],
    bullets: [
      'Our team will keep you updated regarding any route disruption or revised arrival window',
      'TOTER is not liable for indirect or consequential expenses arising from unavoidable transit delays beyond our control',
    ],
  },
  {
    id: 'liability-for-loss-or-damage',
    number: '08',
    icon: ShieldAlert,
    title: 'Liability for Loss or Damage',
    paragraphs: [
      'Our crew follows structured handling protocols to protect your goods throughout packing, loading, transit, and unloading. Customers are encouraged to discuss transit protection or cargo risk coverage options with our coordinator prior to dispatch, particularly for long-distance, commercial, vehicle, or international shipments.',
      'Any visible external damage or missing package must be brought to the attention of the move supervisor and recorded on the consignment delivery receipt at the time of unloading.',
    ],
    bullets: [
      'No liability is assumed for undeclared valuables, jewelry, currency, or prohibited items packed without our knowledge',
      'No liability is assumed for internal damage inside boxes packed by the customer or for pre-existing wear, scratches, or mechanical/electronic faults',
    ],
    ownerReviewNote:
      'Owner Review Note: Specific carrier liability limits, optional transit insurance / declared-value protection terms, third-party insurer policy conditions, and formal claim filing time limits should be reviewed and finalized by business ownership.',
  },
  {
    id: 'dispute-resolution',
    number: '09',
    icon: Scale,
    title: 'Dispute Resolution',
    paragraphs: [
      'In the event of any concern, billing question, or service grievance, customers should first contact our customer support desk so our management team can review the booking records and work toward a prompt, fair resolution.',
      'Any unresolved legal dispute arising out of or relating to services provided by TOTER Packers & Movers shall be governed by the laws of India.',
    ],
    bullets: [
      'Direct escalation channel via our official support email and telephone number',
      'Good-faith review of signed inventory checklists, quotation documents, and delivery receipts',
    ],
    ownerReviewNote:
      'Owner Review Note: Exclusive court jurisdiction / arbitration venue (e.g., New Delhi courts) should be verified by the business owner or legal counsel.',
  },
  {
    id: 'contact-information',
    number: '10',
    icon: Phone,
    title: 'Contact Information',
    paragraphs: [
      'For questions about these Terms of Service, quotation clarifications, or booking assistance, please contact TOTER Packers & Movers using our official contact details.',
    ],
    bullets: [
      `Business Name: ${siteConfig.legalEntityName}`,
      `Phone: ${siteConfig.contact.phoneDisplay}`,
      `Email: ${siteConfig.contact.email}`,
      `Address: ${siteConfig.contact.addressSummary}`,
    ],
  },
];

export const TermsOfServicePage: React.FC = () => {
  useEffect(() => {
    const title = 'Terms of Service | TOTER Packers & Movers';
    const description =
      'Review the Terms of Service for TOTER Packers & Movers covering quotations, booking conditions, packing and customer responsibilities, transit, and support.';

    document.title = title;
    if (typeof document.querySelector === 'function') {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
    window.scrollTo(0, 0);
  }, []);

  const whatsappUrl =
    'https://wa.me/917428614678?text=' +
    encodeURIComponent('Hi Toter, I would like to clarify booking terms and get a moving quotation.');

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
                Terms of Service
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF641A]/15 border border-[#FF641A]/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF641A] mb-4">
              <FileCheck className="w-3.5 h-3.5" />
              Service Conditions &amp; Guidelines
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Terms of <span className="text-[#FF641A]">Service</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Please read these Terms of Service carefully before booking packing, relocation, vehicle carrier, or freight services with <strong className="text-white">{siteConfig.legalEntityName}</strong>.
            </p>
            <p className="mt-4 text-xs text-white/50">
              Last Updated: November 2026 &bull; Standard Operational Terms for {siteConfig.legalEntityName}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Main Content & Sidebar ────────────────────────────────── */}
      <section className="py-16 lg:py-20 border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-6">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#FF641A] mb-3">
                    Terms Overview
                  </h2>
                  <ul className="space-y-1.5 text-sm">
                    {termsSections.map((sec) => (
                      <li key={sec.id}>
                        <a
                          href={`#${sec.id}`}
                          className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span className="text-xs font-bold text-[#FF641A]">{sec.number}</span>
                          <span>{sec.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3">
                    Related Pages
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
                      to="/moving-faq"
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-[#FF641A]/15 border border-white/10 hover:border-[#FF641A]/35 text-white/80 hover:text-white transition-all"
                    >
                      <span>Moving FAQ</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF641A]" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Terms Sections */}
            <div className="lg:col-span-8 space-y-8">
              {termsSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 rounded-2xl bg-white/[0.03] border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#FF641A]/15 border border-[#FF641A]/30 flex items-center justify-center text-[#FF641A] shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF641A]">
                          Clause {section.number}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm sm:text-base text-white/75 leading-relaxed mb-5">
                      {section.paragraphs.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>

                    <ul className="space-y-2.5 bg-[#060e1b]/70 border border-white/8 rounded-xl p-4 sm:p-5">
                      {section.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF641A] mt-2 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {section.ownerReviewNote && (
                      <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs sm:text-sm text-amber-200/90">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{section.ownerReviewNote}</span>
                      </div>
                    )}
                  </article>
                );
              })}

              {/* Direct Contact Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0b1b33] to-[#060e1b] border border-[#FF641A]/30 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                  Need Clarification Before Booking?
                </h2>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                  Our move coordinators are happy to explain quotation line items, packing scope, and transit schedules before you confirm your move.
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
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-[#FF641A] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-white/50">Head Office</div>
                      <div className="text-white/85 text-xs sm:text-sm">{siteConfig.contact.addressSummary}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Internal Links to Core Relocation Services ────────────── */}
      <section className="py-14 bg-[#060e1b] border-b border-white/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF641A]">
              Our Service Portfolio
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Explore TOTER Moving &amp; Freight Services
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
                Ready to Request Your <span className="text-[#FF641A]">Moving Quote</span>?
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-8 leading-relaxed">
                Get a transparent, written estimate for your upcoming residential, office, vehicle, or cargo move.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={siteConfig.contact.phoneRaw}
                  className="inline-flex items-center gap-2 bg-[#FF641A] hover:bg-orange-500 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg shadow-lg transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  Call {siteConfig.contact.phoneDisplay}
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
                  Request a Quote &rarr;
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default TermsOfServicePage;
