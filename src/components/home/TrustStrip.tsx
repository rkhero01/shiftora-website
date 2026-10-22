import React from 'react';
import { PackageCheck, ReceiptText, Headphones, Clock } from 'lucide-react';
import { Container } from '../common/Container';

interface BenefitItem {
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const benefits: BenefitItem[] = [
  {
    title: 'Careful Packing',
    subtitle: 'High-density bubble wrap, sturdy cartons, and protective edge padding for all goods.',
    icon: PackageCheck,
  },
  {
    title: 'Transparent Quotes',
    subtitle: 'Clear, itemized moving estimates with zero surprise fees on relocation day.',
    icon: ReceiptText,
  },
  {
    title: 'Dedicated Move Support',
    subtitle: 'Direct communication with your move coordinator from pickup to final delivery.',
    icon: Headphones,
  },
  {
    title: 'Planned Delivery',
    subtitle: 'Punctual transit schedules, coordinated arrival windows, and organized placement.',
    icon: Clock,
  },
];

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-slate-50 border-b border-slate-200/90 py-10">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-amber-300 transition-all flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{benefit.title}</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{benefit.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
