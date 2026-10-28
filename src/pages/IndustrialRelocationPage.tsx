import React from 'react';
import {
  Factory,
  Cog,
  ShieldAlert,
  Truck,
  HardHat,
  Scale,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const IndustrialRelocationPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Industrial Relocation Services | Shiftora Packers & Movers"
      categoryLabel="Heavy Plant & Machinery Shifting"
      heading="Heavy Machinery & Plant"
      headingAccent="Industrial Relocation"
      subheading="Engineered heavy machinery shifting, factory transfers, manufacturing line decommissioning, hydraulic crane rigging, and multi-axle trailer transport across India with strict safety protocols."
      heroImage="/images/packed-industrial-cargo.jpg"
      heroImageAlt="Large packed industrial machinery cargo prepared for transport"
      galleryImage="/images/cargo-loading-team.jpg"
      galleryImageAlt="Shiftora cargo handling team coordinating industrial equipment loading"
      whatsappMessage="Hi Shiftora, I would like to get a quote for Industrial Relocation."
      highlights={[
        'Hydraulic crane lifting, forklift rigging & machinery skidding',
        'Low-bed, semi-lowbed & multi-axle trailers for Over-Dimensional Cargo (ODC)',
        'Machinery de-anchoring, anti-rust greasing & heavy-duty shrink barrier wraps',
        'Certified riggers, route engineering surveys & government permit approvals',
      ]}
      features={[
        {
          icon: <Factory className="w-6 h-6" />,
          title: 'Complete Plant & Factory Moves',
          description:
            'Turnkey factory relocation spanning production lines, testing laboratories, raw material stores, and maintenance workshops.',
        },
        {
          icon: <Cog className="w-6 h-6" />,
          title: 'Machinery Decommissioning & Rigging',
          description:
            'Systematic disconnection of electrical and pneumatic lines, de-anchoring from foundation plinths, and precision leveling.',
        },
        {
          icon: <Truck className="w-6 h-6" />,
          title: 'Multi-Axle & Low-Bed Trailers',
          description:
            'Heavy-haul fleet capable of handling over-dimensional cargo (ODC), CNC machines, stamping presses, and transformers.',
        },
        {
          icon: <HardHat className="w-6 h-6" />,
          title: 'Certified Riggers & Safety Protocols',
          description:
            'Strict adherence to industrial safety standards with certified crane operators, personal protective equipment, and risk management.',
        },
        {
          icon: <Scale className="w-6 h-6" />,
          title: 'Route Feasibility & Bridge Permits',
          description:
            'Pre-transit civil route surveys checking overhead bridge clearances, toll bypasses, and state authority highway permits.',
        },
        {
          icon: <ShieldAlert className="w-6 h-6" />,
          title: 'High-Value Industrial Marine Cover',
          description:
            'Comprehensive industrial transit and erection-all-risks (EAR) insurance for total asset protection during transit and rigging.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Engineering Site Survey',
          description:
            'Assessing machine weight, dimensions, center of gravity, floor load limits, and rigging access points.',
        },
        {
          number: '02',
          title: 'De-Anchoring & Protective Packaging',
          description:
            'Electrical isolation, fluid draining, protective barrier vacuum wrapping, and heavy timber skidding.',
        },
        {
          number: '03',
          title: 'Crane Rigging & Multi-Axle Transit',
          description:
            'Precision crane loading onto specialized low-bed trailers, secure multi-chain tie-downs, and escorted highway transit.',
        },
        {
          number: '04',
          title: 'Offloading & Foundation Positioning',
          description:
            'Crane offloading at destination facility, skidding onto foundation plinths, optical alignment, and final handover.',
        },
      ]}
    />
  );
};
