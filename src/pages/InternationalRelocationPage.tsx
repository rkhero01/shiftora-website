import React from 'react';
import {
  Globe2,
  FileCheck2,
  Box,
  Anchor,
  Plane,
  BadgeCheck,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const InternationalRelocationPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="International Relocation Services | Shiftora Packers & Movers"
      categoryLabel="Cross-Border Global Relocations"
      heading="Global Relocation With Full"
      headingAccent="Customs Clearance"
      subheading="Move across borders with absolute confidence. Shiftora provides export-standard wooden crating, international customs documentation, marine cargo insurance, and door-to-door delivery worldwide."
      heroImage="/images/container-palletized-cargo.jpg"
      heroImageAlt="Palletized cargo secured inside a freight container for international shipping"
      galleryImage="/images/freight-container-loading.jpg"
      galleryImageAlt="Relocation cargo arranged inside a maritime shipping container"
      whatsappMessage="Hi Shiftora, I would like to get a quote for International Relocation."
      highlights={[
        'ISPM-15 certified heat-treated wooden crates for fragile & high-value goods',
        'End-to-end customs documentation, bill of lading & transfer-of-residence advisory',
        'FCL (Full Container) and LCL (Shared Container) ocean shipping options',
        'Accredited worldwide destination partners for local clearance and setup',
      ]}
      features={[
        {
          icon: <Globe2 className="w-6 h-6" />,
          title: 'Worldwide Destination Coverage',
          description:
            'Reliable relocation routes across North America, Europe, the Middle East, UK, Southeast Asia, Australia, and 100+ countries.',
        },
        {
          icon: <Box className="w-6 h-6" />,
          title: 'Export-Grade Wooden Crating',
          description:
            'Custom fumigated wooden boxes, moisture-proof barriers, and silica desiccant pouches safeguard cargo during long ocean transit.',
        },
        {
          icon: <FileCheck2 className="w-6 h-6" />,
          title: 'Customs & Transfer of Residence Advisory',
          description:
            'Guidance on duty exemptions, customs declarations, passport clearances, and required origin/destination paperwork.',
        },
        {
          icon: <Anchor className="w-6 h-6" />,
          title: 'Ocean Freight (FCL & LCL)',
          description:
            'Full 20ft/40ft containers for entire households, or cost-effective groupage/LCL options for smaller shipments.',
        },
        {
          icon: <Plane className="w-6 h-6" />,
          title: 'Priority Air Freight Option',
          description:
            'Fast-track air cargo solutions for essential wardrobe, documents, and urgent personal effects needed immediately upon arrival.',
        },
        {
          icon: <BadgeCheck className="w-6 h-6" />,
          title: 'Marine & International All-Risk Cover',
          description:
            'Comprehensive international transit coverage protecting your consignment from origin door to overseas destination room.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Virtual Survey & Route Planning',
          description:
            'Evaluating shipment cubic meters (CBM), choosing between ocean or air, and outlining destination customs prerequisites.',
        },
        {
          number: '02',
          title: 'Export Packing & Fumigation',
          description:
            'Trained export packers use multi-ply corrugated rolls, bubble cushioning, and certified ISPM-15 wooden crating.',
        },
        {
          number: '03',
          title: 'Port Clearance & Ocean/Air Transit',
          description:
            'Managing origin export customs, container stuffing, bill of lading issuance, and continuous vessel tracking.',
        },
        {
          number: '04',
          title: 'Destination Clearance & Door Delivery',
          description:
            'Overseas partner coordinates port clearance, transport to your new home, unloading, and debris disposal.',
        },
      ]}
    />
  );
};
