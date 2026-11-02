import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  brandName: 'TOTER',
  legalEntityName: 'TOTER Packers & Movers',
  tagline: 'Moving Beyond Borders, Delivering With Care.',
  description:
    'Toter provides dependable home and office relocation, careful multi-layer packing, transparent pricing, and planned transit coordination.',
  
  contact: {
    phoneDisplay: '+91 8368743974',
    phoneRaw: 'tel:+918368743974',
    email: 'contact@toter.in',
    operatingHours: 'Mon - Sun: 7:00 AM - 9:00 PM',
    addressSummary: 'Bharthal - Dada Mota Mandir, Dwarka Sector-26, Dwarka, New Delhi 110077',
  },

  serviceAreas: [
    { name: 'Mumbai', stateOrRegion: 'Maharashtra', popular: true },
    { name: 'Bengaluru', stateOrRegion: 'Karnataka', popular: true },
    { name: 'Delhi NCR', stateOrRegion: 'National Capital Region', popular: true },
    { name: 'Hyderabad', stateOrRegion: 'Telangana', popular: true },
    { name: 'Pune', stateOrRegion: 'Maharashtra', popular: true },
    { name: 'Chennai', stateOrRegion: 'Tamil Nadu', popular: true },
    { name: 'Kolkata', stateOrRegion: 'West Bengal' },
    { name: 'Ahmedabad', stateOrRegion: 'Gujarat' },
  ],

  services: [
    {
      id: 'residential-relocation',
      title: 'Residential Relocation',
      href: '/services/residential-relocation',
      shortDescription:
        'Complete home relocation covering delicate glassware, large furniture disassembly, shock-absorbing wrapping, and room-wise unpacking.',
      iconName: 'Home',
      features: ['Multi-layer carton packing', 'Furniture wrapping & disassembly', 'Room-by-room unloading & setup'],
    },
    {
      id: 'corporate-shifting-service',
      title: 'Corporate Shifting Service',
      href: '/services/corporate-shifting-service',
      shortDescription:
        'Zero-downtime enterprise and branch moves engineered to transfer executive cabins, IT server racks, and departmental assets on schedule.',
      iconName: 'Building2',
      features: ['IT & server flight-case packing', 'Serialized employee desk tagging', 'Weekend & after-hours execution'],
    },
    {
      id: 'office-relocation',
      title: 'Office Relocation',
      href: '/services/office-relocation',
      shortDescription:
        'Structured workplace relocations designed to protect desktop PCs, monitors, modular workstations, and files with minimal disruption.',
      iconName: 'Briefcase',
      features: ['Floor-plan inventory mapping', 'Workstation dismantling & setup', 'Debris removal & clean handover'],
    },
    {
      id: 'door-to-door-relocation',
      title: 'Door-to-Door Relocation',
      href: '/services/door-to-door-relocation',
      shortDescription:
        'Turnkey origin-to-destination moving from packing the first glass at your old home to setting up every room at your new address.',
      iconName: 'KeyRound',
      features: ['Zero third-party handoffs', 'Sealed dedicated container trucks', 'Single move coordinator'],
    },
    {
      id: 'international-relocation',
      title: 'International Relocation',
      href: '/services/international-relocation',
      shortDescription:
        'Cross-border global relocations with ISPM-15 export wooden crating, customs clearance documentation, and worldwide door delivery.',
      iconName: 'Globe',
      features: ['ISPM-15 export wooden crating', 'Customs & documentation advisory', 'FCL, LCL & air cargo options'],
    },
    {
      id: 'car-shifting-by-car-carrier',
      title: 'Car Shifting by Car Carrier',
      href: '/services/car-shifting-by-car-carrier',
      shortDescription:
        'Safe automobile transport via enclosed hydraulic car haulers with 360° inspection sign-off and four-point wheel restraints.',
      iconName: 'Car',
      features: ['Hydraulic ramp loading', '360° digital condition report', 'Four-point wheel tie-down locks'],
    },
    {
      id: 'industrial-relocation',
      title: 'Industrial Relocation',
      href: '/services/industrial-relocation',
      shortDescription:
        'Heavy plant and machinery shifting, factory transfers, hydraulic crane rigging, and multi-axle trailer transport across India.',
      iconName: 'Factory',
      features: ['Hydraulic crane & rigging crew', 'Low-bed & multi-axle trailers', 'Route surveys & ODC permits'],
    },
    {
      id: 'air-freight',
      title: 'Air Freight',
      href: '/services/air-freight',
      shortDescription:
        'Express domestic and international aviation cargo with priority airline space allocation, IATA packaging, and AWB tracking.',
      iconName: 'Plane',
      features: ['Next-Flight-Out (NFO) express', 'IATA-compliant cargo packing', 'Airport-to-door delivery'],
    },
    {
      id: 'sea-freight',
      title: 'Sea Freight',
      href: '/services/sea-freight',
      shortDescription:
        'Cost-effective Full Container Load (FCL) and shared LCL ocean shipping connecting major Indian ports with global shipping lanes.',
      iconName: 'Ship',
      features: ['20ft & 40ft FCL / LCL groupage', 'Port customs & B/L clearance', 'Anti-moisture marine packaging'],
    },
    {
      id: 'road-freight',
      title: 'Road Freight',
      href: '/services/road-freight',
      shortDescription:
        'Pan-India dedicated Full Truckload (FTL) and Part Truckload (PTL) highway container transport with live GPS tracking.',
      iconName: 'Truck',
      features: ['14ft to 32ft closed containers', 'E-Way bill & GST compliance', 'Live GPS checkpoint tracking'],
    },
  ],

  trustPillars: [
    {
      title: 'Careful Handling',
      description:
        'Trained crew members follow item-specific packing protocols using multi-layer bubble wrap, edge guards, and stretch film.',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Organized Planning',
      description:
        'Structured move schedules, box indexing, and designated truck space ensure predictable timing and zero chaos.',
      iconName: 'CalendarCheck',
    },
    {
      title: 'Clear Estimates',
      description:
        'Transparent, line-item quotations provided upfront before moving day. No hidden fees or surprise destination surcharges.',
      iconName: 'ReceiptText',
    },
    {
      title: 'Customer Communication',
      description:
        'Consistent milestone communication and a direct move supervisor available throughout loading, transit, and unloading.',
      iconName: 'Headphones',
    },
  ],

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Why Toter', href: '/#why-us' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Service Areas', href: '/#service-areas' },
    { label: 'Get Quote', href: '/#get-quote' },
  ],
};
