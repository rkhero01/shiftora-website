import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  brandName: 'Shiftora',
  legalEntityName: 'Shiftora Logistics & Relocations',
  tagline: 'Moving Made Simple. Every Step of the Way.',
  description:
    'Shiftora provides dependable home and office relocation, careful multi-layer packing, transparent pricing, and planned transit coordination.',
  
  contact: {
    phoneDisplay: '+91 8368743974',
    phoneRaw: 'tel:+918368743974',
    email: 'contact@shiftora.in',
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
      id: 'household-shifting',
      title: 'Household Shifting',
      shortDescription:
        'Complete home relocation covering delicate glassware, large furniture disassembly, shock-absorbing wrapping, and room-wise unpacking.',
      iconName: 'Home',
      features: ['Multi-layer carton packing', 'Furniture wrapping & disassembly', 'Door-to-door transit care'],
    },
    {
      id: 'office-relocation',
      title: 'Office Relocation',
      shortDescription:
        'Structured corporate transitions designed to protect servers, monitors, workstations, and files while minimizing work hours interruption.',
      iconName: 'Building2',
      features: ['IT equipment labeling', 'Weekend & overnight moving slots', 'Desk setup coordination'],
    },
    {
      id: 'domestic-moving',
      title: 'Domestic Moving',
      shortDescription:
        'Scheduled intercity shifting linking major regional hubs with dedicated transit containers and progress status milestones.',
      iconName: 'Compass',
      features: ['Direct interstate freight routes', 'Pre-transit inventory audit', 'Transit checkpoint updates'],
    },
    {
      id: 'car-bike-transportation',
      title: 'Car and Bike Transportation',
      shortDescription:
        'Safe vehicle transport via enclosed hydraulic car haulers and specialized two-wheeler crates with wheel-locking clamps.',
      iconName: 'Truck',
      features: ['Hydraulic ramp loading', 'Condition inspection sign-off', 'Secure tie-down harnesses'],
    },
    {
      id: 'packing-unpacking',
      title: 'Packing and Unpacking',
      shortDescription:
        'Specialized packing labor using heavy-gauge bubble wrap, corrugated sheets, edge guards, and optional post-move unpacking.',
      iconName: 'Package',
      features: ['Fragile item boxing', 'Numbered box inventory', 'Debris & box removal options'],
    },
    {
      id: 'storage-solutions',
      title: 'Storage Solutions',
      shortDescription:
        'Secure short-term and long-term warehousing units protected with 24/7 CCTV, pest management, and clean palletized stacking.',
      iconName: 'Warehouse',
      features: ['24/7 monitored facility', 'Flexible monthly leasing', 'Clean moisture-controlled units'],
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
    { label: 'Services', href: '#services' },
    { label: 'Why Shiftora', href: '#why-us' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Service Areas', href: '#service-areas' },
    { label: 'Get Quote', href: '#get-quote' },
  ],
};
