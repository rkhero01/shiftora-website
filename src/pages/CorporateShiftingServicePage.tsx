import React from 'react';
import {
  Server,
  Layers,
  FileText,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const CorporateShiftingServicePage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Corporate Shifting Services | Shiftora Packers & Movers"
      categoryLabel="Enterprise Relocation"
      heading="Zero-Downtime Corporate &"
      headingAccent="Branch Relocation"
      subheading="Engineered corporate moves designed to transfer executive cabins, conference infrastructure, sensitive records, workstations, and server racks with flexible weekend and after-hours schedules."
      heroImage="/images/organized-shipping-cartons.jpg"
      heroImageAlt="Organized shipping cartons secured for a coordinated corporate shipment"
      galleryImage="/images/warehouse-carton-shipment.jpg"
      galleryImageAlt="Corporate relocation assets organized in Shiftora storage warehouse"
      whatsappMessage="Hi Shiftora, I would like to get a free corporate shifting quote for our company."
      highlights={[
        'Weekend & overnight moving slots to prevent operational downtime',
        'Anti-static bubble wrap & padded flight cases for IT equipment',
        'Serialized employee desk labeling & barcoded tracking',
        'Dedicated corporate move manager assigned on-site',
      ]}
      features={[
        {
          icon: <Server className="w-6 h-6" />,
          title: 'IT & Data Center Relocation',
          description:
            'Anti-static packaging, specialized server shock-racks, monitor sleeves, and numbered cable labeling for quick IT reconnection.',
        },
        {
          icon: <Layers className="w-6 h-6" />,
          title: 'Serialized Asset Tracking',
          description:
            'Every carton, chair, workstation component, and peripheral is tagged with department and desk codes for systematic mapping.',
        },
        {
          icon: <Building className="w-6 h-6" />,
          title: 'Modular Workstation Dismantling',
          description:
            'Expert disassembly and re-erection of cubicles, partitions, acoustic dividers, executive desks, and conference tables.',
        },
        {
          icon: <FileText className="w-6 h-6" />,
          title: 'Secure Records & Archive Handling',
          description:
            'Tamper-evident seals and locked security crates safeguard confidential HR, legal, and financial archives in transit.',
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: 'Phased Departmental Schedules',
          description:
            'Custom staging plans move non-critical departments first, enabling uninterrupted client operations during the transition.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'Corporate SLA & Transit Insurance',
          description:
            'Comprehensive corporate transit policy and formal Service Level Agreements ensuring adherence to deadlines.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Facility Audit & Staging Plan',
          description:
            'On-site evaluation of workstations, IT infrastructure, elevator access, and building management guidelines.',
        },
        {
          number: '02',
          title: 'Color-Coded Packing & Tagging',
          description:
            'Desk-by-desk packing kits distributed to employees; IT assets securely packed in shockproof flight cases and anti-static wraps.',
        },
        {
          number: '03',
          title: 'After-Hours Transit Coordination',
          description:
            'Loading and direct transit carried out overnight or over the weekend to eliminate interruption to business hours.',
        },
        {
          number: '04',
          title: 'New Site Reassembly & Handover',
          description:
            'Unloading onto corresponding floor plans, assembling furniture, positioning desk boxes, and final sign-off inspection.',
        },
      ]}
    />
  );
};
