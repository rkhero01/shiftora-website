import React from 'react';
import {
  Monitor,
  CheckSquare,
  Briefcase,
  Sliders,
  Sparkles,
  Shield,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const OfficeRelocationPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Office Relocation Services | Shiftora Packers & Movers"
      categoryLabel="Commercial Workplace Moves"
      heading="Seamless Office Moves With"
      headingAccent="Minimal Disruption"
      subheading="From agile startups to multi-story headquarters, Shiftora executes structured office relocations covering ergonomic furniture, conference audio-visual systems, pantry hardware, and departmental inventories."
      heroImage="/images/stacked-freight-boxes.jpg"
      heroImageAlt="Labeled shipment cartons organized for office relocation transport"
      galleryImage="/images/container-shipment-boxes.jpg"
      galleryImageAlt="Shiftora shipping container loaded with secure office cartons and equipment"
      whatsappMessage="Hi Shiftora, I would like to get a quote for Office Relocation."
      highlights={[
        'Floor-plan mapping with color-coded desk assignment labels',
        'Anti-static bubble cushioning for desktop PCs, printers & monitors',
        'Safe packaging for conference AV gear and projector setups',
        'Swift turn-around designed around your work calendar',
      ]}
      features={[
        {
          icon: <Monitor className="w-6 h-6" />,
          title: 'Workstation & PC Packaging',
          description:
            'Dedicated CPU boxes, padded keyboard bags, monitor corner guards, and labeled peripheral zip-pouches for every employee.',
        },
        {
          icon: <CheckSquare className="w-6 h-6" />,
          title: 'Floor-Plan Inventory Mapping',
          description:
            'Color-coded stickers mapped against architectural layouts ensure cartons arrive precisely at the designated desk in the new office.',
        },
        {
          icon: <Briefcase className="w-6 h-6" />,
          title: 'Executive Cabin & Boardroom Care',
          description:
            'High-grade furniture blankets and corner cushions protect premium solid wood executive desks, leather chairs, and conference tables.',
        },
        {
          icon: <Sliders className="w-6 h-6" />,
          title: 'Modular Panel & Shelf Deconstruction',
          description:
            'Trained assemblers dismantle filing cabinets, compactors, whiteboards, and modular glass partitions with zero damage.',
        },
        {
          icon: <Sparkles className="w-6 h-6" />,
          title: 'Debris Removal & Clean Handover',
          description:
            'After unpacking at the destination, our crew clears away all carton scraps, stretch wraps, and tapes for a pristine handover.',
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: 'All-Risk Commercial Moving Cover',
          description:
            'Full transit protection policy covering physical loss or impact damage during transport, loading, and unloading.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Site Survey & Layout Consultation',
          description:
            'Detailed review of current inventory, elevator dimensions, parking docks, and target floor plan assignments.',
        },
        {
          number: '02',
          title: 'Pre-Move Labeling & Material Supply',
          description:
            'Color-coded labeling kits, crate drops, and personal item packing boxes delivered to staff ahead of moving day.',
        },
        {
          number: '03',
          title: 'Systematic Loading & Transfer',
          description:
            'Loading grouped by department onto closed-container transport trucks with tied-down security locks.',
        },
        {
          number: '04',
          title: 'Placement, Assembly & Debris Clearance',
          description:
            'Items delivered to respective desks and zones, furniture assembled, and packing waste promptly cleared.',
        },
      ]}
    />
  );
};
