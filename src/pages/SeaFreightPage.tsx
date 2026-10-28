import React from 'react';
import {
  Anchor,
  Box,
  FileText,
  ShieldCheck,
  Ship,
  TrendingDown,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const SeaFreightPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Sea Freight Services | Shiftora Packers & Movers"
      categoryLabel="Ocean Maritime Logistics"
      heading="Cost-Effective Ocean Cargo &"
      headingAccent="Container Shipping"
      subheading="Full Container Load (FCL) and Less than Container Load (LCL) ocean freight services connecting major Indian ports with worldwide shipping lanes, port clearance, and marine cargo insurance."
      heroImage="/images/freight-container-loading.jpg"
      heroImageAlt="Palletized cargo arranged inside a maritime shipping container"
      galleryImage="/images/container-shipment-boxes.jpg"
      galleryImageAlt="Organized cartons packed for maritime sea freight transport"
      whatsappMessage="Hi Shiftora, I would like to get a quote for Sea Freight shipping."
      highlights={[
        'Full Container Load (20ft, 40ft, 40ft HC) and cost-effective LCL consolidation',
        'Direct port handling at Nhava Sheva (JNPT), Mundra, Chennai, and Kolkata',
        'Customs bill of lading (B/L) processing, port documentation & fumigation certificates',
        'Industrial desiccant bags & anti-moisture inner lining preventing sea-sweat damage',
      ]}
      features={[
        {
          icon: <Ship className="w-6 h-6" />,
          title: 'Full Container Load (FCL)',
          description:
            'Dedicated 20-foot and 40-foot containers exclusively reserved for your cargo, eliminating multi-shipper handling risks.',
        },
        {
          icon: <TrendingDown className="w-6 h-6" />,
          title: 'LCL Shared Groupage Consolidation',
          description:
            'Cost-efficient ocean transit for partial volumes where you only pay for the exact cubic meters (CBM) your cargo occupies.',
        },
        {
          icon: <Box className="w-6 h-6" />,
          title: 'Marine Moisture & Rust Defense',
          description:
            'Heavy-gauge container liners, vacuum barrier packaging, and silica desiccants safeguard against saltwater humidity.',
        },
        {
          icon: <FileText className="w-6 h-6" />,
          title: 'Port Customs & Terminal Clearance',
          description:
            'Experienced customs house agents (CHA) oversee export inspection, container stuffing, and terminal gate entry.',
        },
        {
          icon: <Anchor className="w-6 h-6" />,
          title: 'Global Port Network Connections',
          description:
            'Reliable vessel schedules across Europe, the Persian Gulf, US East & West Coasts, Southeast Asia, and Africa.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'Institute Cargo Clauses (A) Insurance',
          description:
            'All-risk marine cargo policy covering general average, water ingress, vessel distress, and physical transit loss.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Volume Assessment & Container Selection',
          description:
            'Calculating cargo CBM and total gross weight to recommend between FCL dedicated container or LCL consolidation.',
        },
        {
          number: '02',
          title: 'Export Packing & Palletization',
          description:
            'Pallet wrapping, strapping, weatherproofing, and fumigation stamp compliance prior to port transport.',
        },
        {
          number: '03',
          title: 'Customs Stuffing & Vessel Loading',
          description:
            'Container loading at CFS terminal, customs clearance seal applied, and gantry crane loading onto the container ship.',
        },
        {
          number: '04',
          title: 'Ocean Voyage & Port Clearance',
          description:
            'Real-time vessel tracking, destination customs clearance, and container drayage to the final warehouse or facility.',
        },
      ]}
    />
  );
};
