import React from 'react';
import { Phone, Mail, Clock, MapPin, Shield, CheckCircle, MessageCircle } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from './Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <Container>
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Commitment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                <span className="text-white font-extrabold text-lg">S</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Shift<span className="text-amber-500">ora</span>
              </span>
            </div>
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
              <li><a href="/services/residential-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Residential Relocation</a></li>
              <li><a href="/services/corporate-shifting-service" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Corporate Shifting Service</a></li>
              <li><a href="/services/office-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Office Relocation</a></li>
              <li><a href="/services/door-to-door-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Door To Door Relocation</a></li>
              <li><a href="/services/international-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />International Relocation</a></li>
              <li><a href="/services/car-shifting-by-car-carrier" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Car Shifting By Car Carrier</a></li>
              <li><a href="/services/industrial-relocation" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Industrial Relocation</a></li>
              <li><a href="/services/air-freight" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Air Freight</a></li>
              <li><a href="/services/sea-freight" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Sea Freight</a></li>
              <li><a href="/services/road-freight" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 text-slate-400"><CheckCircle className="w-3.5 h-3.5 text-slate-600" />Road Freight</a></li>
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
            <span className="hover:text-slate-300 transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors">Moving FAQ</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
