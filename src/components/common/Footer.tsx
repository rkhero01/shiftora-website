import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Shield, CheckCircle, MessageCircle } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from './Container';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <Container>
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Commitment */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group" aria-label="Toter Packers and Movers Home">
              <Logo size="md" theme="dark" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Standardized moving procedures &amp; verified handlers.</span>
            </div>
          </div>

          {/* Column 2: Relocation Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services/residential-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Residential Relocation</Link></li>
              <li><Link to="/services/corporate-shifting-service" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Corporate Shifting Service</Link></li>
              <li><Link to="/services/office-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Office Relocation</Link></li>
              <li><Link to="/services/door-to-door-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Door To Door Relocation</Link></li>
              <li><Link to="/services/international-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />International Relocation</Link></li>
              <li><Link to="/services/car-shifting-by-car-carrier" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Car Shifting By Car Carrier</Link></li>
              <li><Link to="/services/industrial-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Industrial Relocation</Link></li>
              <li><Link to="/services/air-freight" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Air Freight</Link></li>
              <li><Link to="/services/sea-freight" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Sea Freight</Link></li>
              <li><Link to="/services/road-freight" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Road Freight</Link></li>
            </ul>
          </div>

          {/* Column 3: Service Hubs & Coverage */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Major Service Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {siteConfig.serviceAreas.map((area) => (
                <span
                  key={area.name}
                  className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {area.name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Inter-city relocation routes available across major transport corridors.
            </p>
          </div>

          {/* Column 4: Contact & Operations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Direct Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex space-x-4 items-start">
                <a href={siteConfig.contact.phoneRaw} className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors group" id="footer-call-link">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white">{siteConfig.contact.phoneDisplay}</span>
                </a>
                <a href="https://wa.me/917428614678" className="flex items-center gap-3 text-slate-300 hover:text-amber-400 transition-colors group">
                  <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-white">WhatsApp</span>
                </a>
              </div>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-start gap-3 text-slate-300 hover:text-amber-400 transition-colors"
                id="footer-email-link"
              >
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="break-all">{siteConfig.contact.email}</span>
              </a>

              <div className="flex items-start gap-3 text-slate-400">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs">{siteConfig.contact.operatingHours}</span>
              </div>

              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.contact.addressSummary)}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs">{siteConfig.contact.addressSummary}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} {siteConfig.legalEntityName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="hover:text-amber-400 transition-colors"
              id="footer-privacy-policy-link"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-amber-400 transition-colors"
              id="footer-terms-of-service-link"
            >
              Terms of Service
            </Link>
            <Link
              to="/moving-faq"
              className="hover:text-amber-400 transition-colors"
              id="footer-moving-faq-link"
            >
              Moving FAQ
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
