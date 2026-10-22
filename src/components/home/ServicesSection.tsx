import React from 'react';
import {
  Home,
  Building2,
  Compass,
  Truck,
  Package,
  Warehouse,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from '../common/Container';
import { Link } from 'react-router-dom';

export const ServicesSection: React.FC = () => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-6 h-6 text-amber-600" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-amber-600" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-amber-600" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-amber-600" />;
      case 'Package':
        return <Package className="w-6 h-6 text-amber-600" />;
      case 'Warehouse':
        return <Warehouse className="w-6 h-6 text-amber-600" />;
      default:
        return <Truck className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-white border-b border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Our Relocation Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Moving Solutions
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Shiftora manages each relocation with specialized packing materials, calibrated transport,
            and dedicated logistics coordination tailored to your inventory.
          </p>
        </div>

          {/* 6 Responsive Service Cards Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.services.map((service) => {
            // Map known service titles to their exact route paths; fallback to home if unknown
            const routeMap: Record<string, string> = {
              'Residential Relocation': '/services/residential-relocation',
              'Corporate Shifting Service': '/services/corporate-shifting-service',
              'Office Relocation': '/services/office-relocation',
              'Door To Door Relocation': '/services/door-to-door-relocation',
              'International Relocation': '/services/international-relocation',
              'Car Shifting By Car Carrier': '/services/car-shifting-by-car-carrier',
              'Industrial Relocation': '/services/industrial-relocation',
              'Air Freight': '/services/air-freight',
              'Sea Freight': '/services/sea-freight',
              'Road Freight': '/services/road-freight',
            };
            const serviceUrl = routeMap[service.title] ?? '#';
            return (
              <Link
                key={service.id}
                to={serviceUrl}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-7 hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  {/* Service Icon */}
                  <div className="w-13 h-13 rounded-xl bg-amber-50 group-hover:bg-amber-100/80 border border-amber-100/90 flex items-center justify-center mb-6 transition-colors shadow-2xs">
                    {getServiceIcon(service.iconName)}
                  </div>

                  {/* Service Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Features List */}
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Link */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#get-quote"
                    className="text-xs font-semibold text-slate-900 group-hover:text-amber-600 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Request Service Quote</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </Link>
            );
          })}

        </div>
      </Container>
    </section>
  );
};
