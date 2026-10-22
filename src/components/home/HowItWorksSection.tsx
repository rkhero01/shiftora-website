import React from 'react';
import { ClipboardList, ReceiptText, Box, CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: StepItem[] = [
  {
    number: '01',
    title: 'Share Your Requirements',
    description:
      'Provide your pickup location, destination, approximate inventory size, and tentative move date.',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: 'Get a Quote',
    description:
      'Receive a transparent, itemized moving estimate with all costs explained upfront—zero hidden charges.',
    icon: ReceiptText,
  },
  {
    number: '03',
    title: 'Packing and Pickup',
    description:
      'Our trained crew arrives on schedule with protective bubble wrap, cartons, and blankets to pack securely.',
    icon: Box,
  },
  {
    number: '04',
    title: 'Delivery and Placement',
    description:
      'Your shipment arrives safely, followed by careful unloading, furniture reassembly, and room placement.',
    icon: CheckCircle2,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/90">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Shiftora Works
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Our straightforward relocation workflow ensures every move is organized, predictable,
            and stress-free from the first phone call to the final box.
          </p>
        </div>

        {/* 4 Steps Timeline / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between relative"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 select-none">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                  <span>Step {step.number}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-500 font-normal">
                    {idx === 0 && 'Initial Details'}
                    {idx === 1 && 'No Obligation'}
                    {idx === 2 && 'Protected Care'}
                    {idx === 3 && 'Final Setup'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
