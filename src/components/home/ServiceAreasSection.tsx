import React from 'react';
import { MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from '../common/Container';

export const ServiceAreasSection: React.FC = () => {
  return (
    <section id="service-areas" className="py-20 bg-white border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Confirmed Service Network
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Metropolitan Hubs &amp; Intercity Corridors
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Shiftora operates within verified regional hubs and intercity corridors connecting these
            major commercial destinations.
          </p>
        </div>

        {/* Verified Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteConfig.serviceAreas.map((area) => (
            <div
              key={area.name}
              className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-amber-300 hover:shadow-md transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-100/80 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                    {area.name}
                  </h3>
                  {area.popular && (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full shrink-0">
                      High Frequency
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{area.stateOrRegion}</p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Local &bull; Intercity Relocation</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Route Feasibility Inquiry Callout */}
        <div className="mt-12 bg-slate-900 text-white rounded-2xl p-7 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold">Relocating to or from another region?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              We operate exclusively along confirmed logistical transit routes. Contact our move
              desk to verify schedule availability for your origin and destination.
            </p>
          </div>

          <a
            href={siteConfig.contact.phoneRaw}
            className="inline-flex items-center gap-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-colors shrink-0"
            id="service-areas-call-check"
          >
            <Phone className="w-4 h-4" />
            <span>Call {siteConfig.contact.phoneDisplay}</span>
          </a>
        </div>
      </Container>
    </section>
  );
};
