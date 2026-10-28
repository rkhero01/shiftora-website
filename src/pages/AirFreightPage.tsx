import React from 'react';
import {
  Plane,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  Zap,
  Globe,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const AirFreightPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Air Freight Services | Shiftora Packers & Movers"
      categoryLabel="Express Aviation Cargo"
      heading="Express Air Cargo With"
      headingAccent="Guaranteed Flight Space"
      subheading="Expedited domestic and international air freight forwarding for time-sensitive commercial shipments, critical components, high-value inventory, and express personal effects."
      heroImage="/images/wrapped-goods-in-transit.jpg"
      heroImageAlt="Wrapped and protected goods prepared for express air freight handling"
      galleryImage="/images/container-palletized-cargo.jpg"
      galleryImageAlt="Palletized air freight cargo prepared for aircraft container loading"
      whatsappMessage="Hi Shiftora, I would like to get a quote for Air Freight services."
      highlights={[
        'Same-day and next-flight-out (NFO) booking on leading domestic & global airlines',
        'Airport-to-airport or full door-to-door expedited delivery models',
        'Automated Air Waybill (AWB) tracking with flight departure and arrival alerts',
        'IATA-compliant packaging and regulated cargo security screening',
      ]}
      features={[
        {
          icon: <Plane className="w-6 h-6" />,
          title: 'Priority Airline Space Allocation',
          description:
            'Longstanding commercial carrier partnerships ensure confirmed belly-cargo space even during peak festive and export seasons.',
        },
        {
          icon: <Zap className="w-6 h-6" />,
          title: 'Next-Flight-Out (NFO) Express',
          description:
            'Urgent delivery tier connecting major Indian metro airports (DEL, BOM, BLR, HYD, MAA, CCU) within 12 to 24 hours.',
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: 'Temperature & Time Sensitive Handling',
          description:
            'Specialized packaging solutions including thermal insulated blankets, dry ice, and temperature data loggers for sensitive cargo.',
        },
        {
          icon: <FileSpreadsheet className="w-6 h-6" />,
          title: 'Customs & Export Documentation',
          description:
            'Complete management of airway bills, customs bills of entry, phytosanitary certificates, and export declarations.',
        },
        {
          icon: <Globe className="w-6 h-6" />,
          title: 'Global Gateway Reach',
          description:
            'Direct and consolidated air cargo connections spanning Dubai, Singapore, Frankfurt, London, New York, and 200+ global air hubs.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'Aviation Transit Insurance',
          description:
            'Comprehensive air cargo cover protecting against handling damage, flight cancellations, or transit loss from door to door.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Cargo Booking & Route Selection',
          description:
            'Volume and deadweight evaluation to identify optimal airline schedules and transparent cost calculations.',
        },
        {
          number: '02',
          title: 'IATA Packaging & Labeling',
          description:
            'Standardized packaging, corner reinforcements, cargo palletizing, and barcode AWB labeling.',
        },
        {
          number: '03',
          title: 'Airport Clearance & Flight Uplift',
          description:
            'Origin terminal security x-ray screening, customs clearance, and confirmed loading onto scheduled aircraft.',
        },
        {
          number: '04',
          title: 'Arrival Clearance & Doorstep Dispatch',
          description:
            'Immediate offloading at destination airport, import terminal clearance, and prompt doorstep delivery via dedicated van.',
        },
      ]}
    />
  );
};
