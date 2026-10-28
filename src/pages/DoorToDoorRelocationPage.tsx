import React from 'react';
import {
  KeyRound,
  ShieldAlert,
  Compass,
  Smile,
  PackageCheck,
  UserCheck,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const DoorToDoorRelocationPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Door-to-Door Relocation Services | Shiftora Packers & Movers"
      categoryLabel="Turnkey Full-Service Moving"
      heading="Complete End-to-End"
      headingAccent="Door-to-Door Relocation"
      subheading="From carefully packing the very first glass at your origin home to placing every couch and wardrobe at your destination, Shiftora manages every single step with zero third-party handoffs."
      heroImage="/images/loaded-moving-truck.jpg"
      heroImageAlt="Shiftora transport truck loaded with goods for direct door-to-door delivery"
      galleryImage="/images/truck-loaded-with-cartons.jpg"
      galleryImageAlt="Transport truck with cartons and furniture secured for nationwide transit"
      whatsappMessage="Hi Shiftora, I would like to get a quote for Door-to-Door Relocation."
      highlights={[
        'Hands-off moving experience — zero packing or heavy lifting required',
        'Direct vehicle dispatch from your old doorstep straight to your new home',
        'Single dedicated relocation supervisor managing the entire route',
        'Transparent itemized quote with all toll, labor, and fuel included',
      ]}
      features={[
        {
          icon: <KeyRound className="w-6 h-6" />,
          title: 'Turnkey Move Management',
          description:
            'You hand over the keys and relax. We supply all packing materials, pack everything, load, transport, unload, and set up.',
        },
        {
          icon: <PackageCheck className="w-6 h-6" />,
          title: 'Full Origin Packing & Box Audit',
          description:
            'Every carton is packed by professional packers with high-density foam, bubble wrap, and an itemized manifest copy given to you.',
        },
        {
          icon: <Compass className="w-6 h-6" />,
          title: 'Dedicated Route Dispatch',
          description:
            'Your goods travel in sealed closed-container trucks without mid-route transfers or hub reloading risks.',
        },
        {
          icon: <UserCheck className="w-6 h-6" />,
          title: 'Single Point of Contact',
          description:
            'A designated relocation coordinator provides milestone updates from packing day until delivery and final walkthrough.',
        },
        {
          icon: <Smile className="w-6 h-6" />,
          title: 'Room-Wise Setup & Unpacking',
          description:
            'Heavy beds assembled, appliances placed into position, and cartons unpacked into cabinets based on your directions.',
        },
        {
          icon: <ShieldAlert className="w-6 h-6" />,
          title: 'Complete Risk & Damage Protection',
          description:
            'Optional comprehensive transit insurance covering transit accidents, fire, and handling claims with expedited processing.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Customized Move Assessment',
          description:
            'Comprehensive review of your inventory, floor levels, parking distance, and target moving timeline.',
        },
        {
          number: '02',
          title: 'Complete Origin Packing',
          description:
            'Full packing crew arrives with premium materials, disassembles furniture, and inventories every package.',
        },
        {
          number: '03',
          title: 'Sealed Direct Transit',
          description:
            'Containers are locked and sealed at your door, moving directly to the destination with continuous GPS tracking.',
        },
        {
          number: '04',
          title: 'Destination Unloading & Setup',
          description:
            'Unloading, furniture reassembly, room-wise placement, and removal of empty packing supplies.',
        },
      ]}
    />
  );
};
