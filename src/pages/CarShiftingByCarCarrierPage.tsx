import React from 'react';
import {
  Car,
  ShieldCheck,
  ClipboardList,
  Lock,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const CarShiftingByCarCarrierPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Car Shifting by Car Carrier | Shiftora Packers & Movers"
      categoryLabel="Specialized Automobile Transit"
      heading="Enclosed & Hydraulic Ramp"
      headingAccent="Car Carrier Transport"
      subheading="Transport your sedan, SUV, electric vehicle, or luxury car across India in fully covered, multi-deck car carriers featuring hydraulic lift ramps, custom wheel locks, and end-to-end transit insurance."
      heroImage="/shiftora-hero-truck.jpg"
      heroImageAlt="Shiftora heavy transport vehicle and enclosed logistics carrier"
      galleryImage="/images/truck-loaded-with-cartons.jpg"
      galleryImageAlt="Secured highway vehicle carrier prepared for long-distance transit"
      whatsappMessage="Hi Shiftora, I would like to get a quote for Car Shifting by Car Carrier."
      highlights={[
        'Covered multi-car carriers protecting against stones, dust, and weather',
        'Hydraulic ramps with shallow entry angles to prevent underbody scraping',
        'Detailed 360° digital condition report with photographic odometer logging',
        'Four-point high-tensile wheel tie-down straps on every vehicle',
      ]}
      features={[
        {
          icon: <Truck className="w-6 h-6" />,
          title: 'Covered Multi-Vehicle Carriers',
          description:
            'Enclosed trailers prevent stone chip hits, rain damage, bird drops, and sun exposure during long highway journeys.',
        },
        {
          icon: <Car className="w-6 h-6" />,
          title: 'Sedans, SUVs & Luxury Cars',
          description:
            'Engineered tie-down clearances accommodating low-ground-clearance sports cars, heavy luxury 4x4s, and electric vehicles.',
        },
        {
          icon: <ClipboardList className="w-6 h-6" />,
          title: '360° Inspection Sign-Off',
          description:
            'Itemized car condition report recording odometer reading, body scratches, and fuel level before release and at handover.',
        },
        {
          icon: <Lock className="w-6 h-6" />,
          title: 'Four-Point Wheel Restraints',
          description:
            'Heavy-duty ratcheted wheel chocks and non-abrasive tire webbing secure each wheel without pulling on vehicle suspension.',
        },
        {
          icon: <CheckCircle className="w-6 h-6" />,
          title: 'Doorstep Pickup & Delivery',
          description:
            'Convenient home pickup and destination delivery with certified driver handoff or flatbed transfer if streets are narrow.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'Dedicated Vehicle Transit Insurance',
          description:
            'Comprehensive automobile transit policy covering transit collision, overturning, or physical damage for full peace of mind.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Booking & Vehicle Audit',
          description:
            'Schedule pickup time, conduct pre-transport digital photo inspection, and record existing condition details.',
        },
        {
          number: '02',
          title: 'Hydraulic Ramp Loading',
          description:
            'Carefully driven onto the carrier ramp and positioned; tires locked into steel channel chocks with ratchet straps.',
        },
        {
          number: '03',
          title: 'Covered Interstate Transit',
          description:
            'Direct highway transport with scheduled driver rotations, checkpoint inspections, and GPS location tracking.',
        },
        {
          number: '04',
          title: 'Destination Unloading & Handover',
          description:
            'Unloaded via ramp at destination, joint physical inspection with the customer against original condition report, and keys handover.',
        },
      ]}
    />
  );
};
