import React from 'react';
import { ShieldCheck, CalendarCheck, ReceiptText, Headphones, Check } from 'lucide-react';
import { Container } from '../common/Container';

interface PillarDetail {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
}

const pillars: PillarDetail[] = [
  {
    title: 'Careful Handling',
    description:
      'Trained crew members follow item-specific packing protocols using multi-layer bubble wrap, edge guards, and stretch film.',
    bullets: [
      'Multi-layer cushioning for delicate glassware',
      'Protective furniture blankets and corner pads',
      'Secure tie-down straps in all moving trucks',
    ],
    icon: ShieldCheck,
  },
  {
    title: 'Organized Planning',
    description:
      'Structured move schedules, box indexing, and designated truck space ensure predictable timing and zero chaos.',
    bullets: [
      'Room-by-room box labeling system',
      'Pre-scheduled loading and dispatch timelines',
      'Systematic unloading based on room placement',
    ],
    icon: CalendarCheck,
  },
  {
    title: 'Clear Estimates',
    description:
      'Transparent, line-item quotations provided upfront before moving day. No hidden fees or surprise destination surcharges.',
    bullets: [
      'Upfront transparent price breakdown',
      'Clear scope of labor and packing supplies',
      'Written quotation before moving day',
    ],
    icon: ReceiptText,
  },
  {
    title: 'Customer Communication',
    description:
      'Consistent milestone communication and a direct move supervisor available throughout loading, transit, and unloading.',
    bullets: [
      'Direct contact line to your move supervisor',
      'Departure and transit progress updates',
      'Prompt telephone assistance during working hours',
    ],
    icon: Headphones,
  },
];

export const WhyShiftoraSection: React.FC = () => {
  return (
    <section id="why-us" className="py-22 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Why Choose Shiftora
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built on Careful Handling &amp; Honest Communication
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Relocating your home or office requires dependable execution. We focus on procedural
            discipline, transparent terms, and responsive customer care.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-7 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shrink-0 text-amber-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {pillar.description}
                  </p>
                </div>

                <ul className="pt-4 border-t border-slate-800 space-y-2">
                  {pillar.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Honest Commitment Footer Callout */}
        <div className="mt-12 bg-slate-950/90 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-400 max-w-2xl mx-auto">
          <span className="text-white font-semibold">Standard Operating Procedures: </span>
          All items are cataloged prior to dispatch. We avoid unsupported promises and focus on proven,
          damage-minimizing packing techniques.
        </div>
      </Container>
    </section>
  );
};
