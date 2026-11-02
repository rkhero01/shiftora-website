import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ChevronRight,
  Lock,
  FileText,
  UserCheck,
  Database,
  Share2,
  Cookie,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { siteConfig } from '../config/siteConfig';

const policySections = [
  {
    id: 'information-we-collect',
    number: '01',
    icon: Database,
    title: 'Information We Collect',
    paragraphs: [
      'When you browse the TOTER Packers & Movers website, request a moving estimate, or contact our team by phone, email, or WhatsApp, we collect only the information reasonably necessary to respond to your enquiry and coordinate your relocation or freight service.',
      'Information may be provided directly by you when filling out an online quotation form, speaking with a relocation coordinator, or communicating relocation inventory details.',
    ],
    bullets: [
      'Origin and destination cities, localities, or pin codes for your planned move',
      'Preferred moving or survey dates and property access details (such as floor level and lift availability)',
      'Approximate household, office, vehicle, or cargo inventory descriptions',
      'Technical browsing data automatically transmitted by your web browser (such as IP address, browser type, device category, and pages visited)',
    ],
  },
  {
    id: 'personal-and-contact-information',
    number: '02',
    icon: UserCheck,
    title: 'Personal and Contact Information',
    paragraphs: [
      'To prepare an accurate moving quotation and coordinate pickup and delivery, we may request basic personal and contact details from you or your authorized representative.',
    ],
    bullets: [
      'Full name and, for corporate or office moves, company or organization name',
      'Primary and alternate telephone or mobile numbers',
      'Email address for sending written estimates, booking confirmations, and move updates',
      'Pickup address and delivery address required for crew dispatch and transport documentation',
    ],
  },
  {
    id: 'how-customer-information-is-used',
    number: '03',
    icon: FileText,
    title: 'How Customer Information Is Used',
    paragraphs: [
      'TOTER Packers & Movers uses customer information strictly for legitimate operational and customer-support purposes related to packing, moving, and logistics services:',
    ],
    bullets: [
      'Evaluating your relocation requirements and preparing a customized moving or freight quotation',
      'Scheduling pre-move surveys, packing crews, transport vehicles, and delivery timelines',
      'Communicating move progress, dispatch updates, and arrival coordination',
      'Preparing standard transport documents, consignment notes, or inventory checklists required for transit',
      'Responding to customer support queries, feedback, or post-move assistance requests',
    ],
  },
  {
    id: 'enquiry-and-quotation-form-data',
    number: '04',
    icon: Mail,
    title: 'Enquiry and Quotation Form Data',
    paragraphs: [
      'Details submitted through our website enquiry or Request a Quote forms—or initiated via our WhatsApp and telephone links—are routed directly to our relocation desk so a coordinator can review your move requirements and contact you.',
      'Submitting an enquiry form is voluntary and does not create a binding service obligation. We retain quotation records only as long as reasonably required to follow up on your move request, fulfill booked services, or maintain basic business records.',
    ],
    bullets: [
      'Used solely to provide estimates and relocation assistance requested by the customer',
      'Not sold, rented, or traded to unrelated third-party marketing lists',
      'Can be updated or corrected at any time by contacting our support desk',
    ],
  },
  {
    id: 'cookies-and-website-analytics',
    number: '05',
    icon: Cookie,
    title: 'Cookies and Website Analytics',
    paragraphs: [
      'Our website may use standard browser cookies or basic analytics tools to ensure pages load reliably, remember user preferences during a session, and understand aggregate visitor traffic across our service pages.',
      'You can configure your web browser to refuse cookies or alert you when cookies are being sent. Disabling optional cookies will not prevent you from viewing our service information or contacting us by phone, WhatsApp, or email.',
    ],
    bullets: [
      'Essential technical data to maintain responsive navigation across desktop and mobile devices',
      'Aggregate, non-identifying page-view insights to improve website clarity and performance',
    ],
  },
  {
    id: 'data-protection-and-security',
    number: '06',
    icon: Lock,
    title: 'Data Protection and Security',
    paragraphs: [
      'We implement practical administrative and technical precautions to safeguard customer contact details, addresses, and move inventories against unauthorized access, misuse, or accidental disclosure.',
      'Access to customer enquiry and booking records is limited to authorized coordination staff and assigned moving personnel who need the information to perform your relocation. While we take reasonable care to protect information transmitted online, no internet or electronic transmission can be guaranteed as completely immune from risk.',
    ],
    bullets: [
      'Restricted internal access to customer pickup and delivery schedules',
      'Direct communication channels via verified company phone numbers and email addresses',
    ],
  },
  {
    id: 'sharing-of-information',
    number: '07',
    icon: Share2,
    title: 'Sharing of Information with Service Partners',
    paragraphs: [
      'To execute inter-city, international, vehicle carrier, air freight, sea freight, or specialized industrial moves, TOTER Packers & Movers may share necessary operational details (such as pickup/delivery addresses, contact numbers, and consignment descriptions) with trusted operational partners involved in fulfilling your move.',
      'Information may also be disclosed where required by law, highway/transport authorities, customs officials (for international shipments), or statutory check-posts during goods transit.',
    ],
    bullets: [
      'Assigned packing supervisors, transport drivers, and destination unloading crews',
      'Partner carriers, freight forwarders, or customs clearance agents when required for your specific route',
      'Regulatory, tax, or transport authorities when legally required for goods movement',
    ],
  },
  {
    id: 'customer-rights-and-contact',
    number: '08',
    icon: Shield,
    title: 'Customer Rights and Contact Information',
    paragraphs: [
      'You may contact TOTER Packers & Movers at any time to review the personal contact details you have shared with us, request corrections to inaccurate information, or ask that we stop contacting you regarding an unbooked quotation enquiry.',
      'For any questions regarding this Privacy Policy or how your information is handled, please reach out to us directly using the official contact details below.',
    ],
    bullets: [
      'Request access to or correction of your contact and quotation details',
      'Opt out of follow-up calls or messages for unconfirmed enquiries',
      'Reach our support team directly via phone, WhatsApp, email, or office visit',
    ],
  },
];

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    const title = 'Privacy Policy | TOTER Packers & Movers';
    const description =
      'Read the Privacy Policy of TOTER Packers & Movers covering how we collect, use, protect, and handle personal contact details and moving quotation enquiries.';

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
    encodeURIComponent('Hi Toter, I have a question regarding your services and privacy policy.');

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
                Privacy Policy
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF641A]/15 border border-[#FF641A]/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF641A] mb-4">
              <Shield className="w-3.5 h-3.5" />
              Data &amp; Privacy Commitment
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Privacy <span className="text-[#FF641A]">Policy</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              This Privacy Policy explains how <strong className="text-white">{siteConfig.legalEntityName}</strong> collects, uses, stores, and protects the information you share when requesting relocation quotes or using our packing, moving, and logistics services.
            </p>
            <p className="mt-4 text-xs text-white/50">
              Last Updated: November 2026 &bull; Applicable to {siteConfig.legalEntityName} website &amp; customer enquiries
            </p>
          </div>
        </Container>
      </section>

      {/* ── Policy Content & Quick Navigation ─────────────────────── */}
      <section className="py-16 lg:py-20 border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 rounded-2xl bg-white/[0.03] border border-white/10 p-6 space-y-6">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#FF641A] mb-3">
                    On This Page
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {policySections.map((sec) => (
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
                    Related Information
                  </h3>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link
                      to="/terms-of-service"
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-[#FF641A]/15 border border-white/10 hover:border-[#FF641A]/35 text-white/80 hover:text-white transition-all"
                    >
                      <span>Terms of Service</span>
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

            {/* Main Sections */}
            <div className="lg:col-span-8 space-y-8">
              {policySections.map((section) => {
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
                          Section {section.number}
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
                  </article>
                );
              })}

              {/* Direct Contact Card for Privacy Queries */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0b1b33] to-[#060e1b] border border-[#FF641A]/30 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                  Contact {siteConfig.legalEntityName}
                </h2>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                  If you have questions about how your enquiry data is handled or wish to update or remove your contact details, please contact our coordination desk directly:
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

      {/* ── Internal Links to Core Relocation Services ────────────── */}
      <section className="py-14 bg-[#060e1b] border-b border-white/10">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF641A]">
              Explore Our Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              TOTER Relocation &amp; Freight Solutions
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
                Planning a Move with <span className="text-[#FF641A]">TOTER</span>?
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-8 leading-relaxed">
                Speak with our relocation coordinators for a clear, itemised moving quotation tailored to your household, office, vehicle, or cargo requirements.
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
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-lg shadow-lg transition-all duration-200"
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
export default PrivacyPolicyPage;
