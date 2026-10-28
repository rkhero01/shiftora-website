import React from 'react';
import {
  Package,
  Wrench,
  Wine,
  Truck,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const ResidentialRelocationPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Residential Relocation Services | Shiftora Packers & Movers"
      categoryLabel="Household Moving"
      heading="Safe, Reliable & Stress-Free"
      headingAccent="Home Relocation"
      subheading="Experience a seamless household move with multi-layer bubble and corrugated packing, trained loading crew, secure transit vehicles, and systematic room-wise placement at your new residence."
      heroImage="/images/packed-freight-cartons.jpg"
      heroImageAlt="Protected cartons prepared for a residential relocation shipment"
      galleryImage="/images/loaded-moving-truck.jpg"
      galleryImageAlt="Shiftora transport truck loaded with cartons ready for dispatch"
      whatsappMessage="Hi Shiftora, I would like to get a free quote for Residential Relocation."
      highlights={[
        'Multi-layer bubble & corrugated cushioning',
        'Specialized handling for fragile crockery & TV/appliances',
        'Furniture disassembly & reassembly included',
        'GPS-tracked transit vehicles across India',
      ]}
      features={[
        {
          icon: <Package className="w-6 h-6" />,
          title: 'Premium Multi-Layer Packing',
          description:
            'Heavy-duty 5-ply cartons, virgin bubble wrap, stretch film, and edge protectors safeguard every single item.',
        },
        {
          icon: <Wrench className="w-6 h-6" />,
          title: 'Furniture Dismantling & Assembly',
          description:
            'Expert carpentry for modular beds, wardrobes, dining tables, and wall units with labeled hardware packaging.',
        },
        {
          icon: <Wine className="w-6 h-6" />,
          title: 'Fragile & Glassware Protocol',
          description:
            'Individual paper-wrapping, honeycomb padding, and custom-crated cartons ensure delicate china and crystal stay intact.',
        },
        {
          icon: <Truck className="w-6 h-6" />,
          title: 'Dedicated Closed-Body Trucks',
          description:
            'Weatherproof, dust-free containers equipped with internal tie-down lashes prevent shifting or scuffs during transit.',
        },
        {
          icon: <Home className="w-6 h-6" />,
          title: 'Room-by-Room Unloading & Setup',
          description:
            'Cartons are unloaded directly into designated rooms, unpacked, and placed where you want them for instant living comfort.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'Transit Insurance & Zero Hidden Fees',
          description:
            'Clear itemized quotations upfront with optional comprehensive transit cover for absolute peace of mind.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Pre-Move Survey & Itemized Quote',
          description:
            'Virtual or physical walk-through to assess volume, determine packing materials, and provide a fixed transparent quote.',
        },
        {
          number: '02',
          title: 'Precision Multi-Layer Packing',
          description:
            'Our trained crew arrives on time with premium supplies, carefully wrapping, categorizing, and inventorying every box.',
        },
        {
          number: '03',
          title: 'Safe Loading & Tracked Transit',
          description:
            'Secured inside specialized closed containers with milestone WhatsApp alerts and on-time transit guarantee.',
        },
        {
          number: '04',
          title: 'Doorstep Delivery & Reassembly',
          description:
            'Careful unloading, furniture reassembly, room placement, and removal of empty packing debris.',
        },
      ]}
    />
  );
};
