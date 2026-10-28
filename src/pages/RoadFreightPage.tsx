import React from 'react';
import {
  Truck,
  MapPin,
  ShieldCheck,
  FileCheck,
  Clock,
  Layers,
} from 'lucide-react';
import { ServicePageLayout } from '../components/common/ServicePageLayout';

export const RoadFreightPage: React.FC = () => {
  return (
    <ServicePageLayout
      pageTitle="Road Freight Services | Shiftora Packers & Movers"
      categoryLabel="Pan-India Surface Transportation"
      heading="Pan-India Dedicated & Part"
      headingAccent="Road Freight Network"
      subheading="Scheduled highway container transport linking all industrial manufacturing corridors and metro centers across India with active GPS tracking, scheduled dispatch times, and verified drivers."
      heroImage="/images/truck-loaded-with-cartons.jpg"
      heroImageAlt="Transport truck loaded with secured cartons for interstate road freight"
      galleryImage="/images/loaded-moving-truck.jpg"
      galleryImageAlt="Shiftora container transport truck prepared for highway freight transit"
      whatsappMessage="Hi Shiftora, I would like to get a quote for Road Freight services."
      highlights={[
        'Full Truckload (FTL) and Part Truckload (PTL) across all 28 states & union territories',
        'Weatherproof closed-body container fleet (14ft, 19ft, 24ft, and 32ft MX/SXL)',
        'Automated E-Way Bill generation, GST documentation & digital POD receipt',
        'Dual-driver long-haul rotations for nonstop transit on national highway expressways',
      ]}
      features={[
        {
          icon: <Truck className="w-6 h-6" />,
          title: 'Full Truckload (FTL) Dedicated Routes',
          description:
            'Point-to-point dedicated container trucks reserved exclusively for your shipment, ensuring zero intermediate handling.',
        },
        {
          icon: <Layers className="w-6 h-6" />,
          title: 'Part Truckload (PTL) Consolidation',
          description:
            'Cost-effective regular scheduled line-haul for smaller commercial consignments, sharing container space securely.',
        },
        {
          icon: <MapPin className="w-6 h-6" />,
          title: 'Live GPS Satellite Tracking',
          description:
            'Real-time truck location visibility with automated checkpoint alerts, speed monitoring, and geofenced security.',
        },
        {
          icon: <FileCheck className="w-6 h-6" />,
          title: 'E-Way Bill & Transit Regulatory Compliance',
          description:
            'Seamless documentation support including E-Way bills, consignment notes (LR), and border tax compliance.',
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: 'Express Transit Timelines',
          description:
            'Optimized highway routing via national expressways (Delhi-Mumbai, Golden Quadrilateral) guaranteeing fast turnarounds.',
        },
        {
          icon: <ShieldCheck className="w-6 h-6" />,
          title: 'All-Risk Road Transit Insurance',
          description:
            'Comprehensive road freight cover safeguarding against highway accidents, rollovers, fire, and load damage.',
        },
      ]}
      processSteps={[
        {
          number: '01',
          title: 'Route & Load Optimization',
          description:
            'Selecting appropriate truck size (14ft to 32ft container) based on weight, volume, and urgency of dispatch.',
        },
        {
          number: '02',
          title: 'Dock Loading & Manifest Verification',
          description:
            'Systematic loading with heavy-duty ratchets, container seal application, and digital Lorry Receipt (LR) issuance.',
        },
        {
          number: '03',
          title: 'Monitored Highway Transit',
          description:
            '24/7 central control room tracking with driver checkpoint reporting and automated transit milestone updates.',
        },
        {
          number: '04',
          title: 'Destination Delivery & Proof of Delivery (POD)',
          description:
            'Prompt doorstep unloading at your warehouse, physical piece-count verification, and electronic signed POD.',
        },
      ]}
    />
  );
};
