import type { ServiceDetail } from '../types';

export const servicesData: Record<string, ServiceDetail> = {
  'household-shifting': {
    id: 'household-shifting',
    title: 'Household Shifting',
    shortDescription:
      'Complete home relocation covering delicate glassware, large furniture disassembly, shock-absorbing wrapping, and room-wise unpacking.',
    iconName: 'Home',
    features: ['Multi-layer carton packing', 'Furniture wrapping & disassembly', 'Door-to-door transit care'],
    heroTagline: 'Safe, Organized Home Relocations with Multi-Layer Protection',
    overview: [
      'Relocating your home involves more than simply transporting boxes—it requires meticulous handling of everyday possessions, sentimental items, and heavy furniture. Shiftora approaches household shifting with standardized packing protocols designed to minimize transit vibration, eliminate surface scratches, and prevent accidental damage.',
      'From apartment moves and independent houses to intercity home shifting, our crew brings all required packaging supplies directly to your doorstep. We catalog your belongings room-by-room so that unpacking at your destination is logical, fast, and structured.',
      'Our team coordinates directly with building management for elevator bookings, loading bay access, and society moving guidelines to ensure zero moving-day friction.',
    ],
    includedItems: [
      '5-ply heavy-gauge corrugated cartons for household goods',
      'High-density bubble cushioning for fragile crockery, glassware, and electronics',
      'Furniture disassembly (beds, modular wardrobes, dining tables) by trained staff',
      'Protective quilted furniture blankets and edge corner protectors',
      'Room-by-room carton color tagging and inventory audit sheets',
      'Careful unloading, furniture reassembly, and designated room placement',
    ],
    process: [
      {
        step: '01',
        title: 'Inventory Assessment & Itemized Quote',
        description:
          'We evaluate your furniture volume, fragile item count, and access points to provide a clear, upfront quote with zero hidden charges.',
      },
      {
        step: '02',
        title: 'Standardized Multi-Layer Packing',
        description:
          'Our packing team wraps delicate items in bubble wrap, boxes electronics with corner pads, and wraps wooden furniture in protective sheets.',
      },
      {
        step: '03',
        title: 'Systematic Truck Loading',
        description:
          'Heavier furniture is anchored at the bottom with tie-down straps, while labeled fragile cartons are cushioned securely in top tiers.',
      },
      {
        step: '04',
        title: 'Monitored Transit to Destination',
        description:
          'Your dedicated move coordinator provides departure confirmation, highway updates, and arrival window coordination.',
      },
      {
        step: '05',
        title: 'Unloading, Reassembly & Setup',
        description:
          'Items are moved into corresponding rooms, major disassembled furniture is reassembled, and boxes are placed for easy unpacking.',
      },
    ],
    faqs: [
      {
        question: 'How do you safeguard fragile glassware, ceramics, and electronics?',
        answer:
          'We use a 4-layer packing technique: delicate items are wrapped individually in high-density bubble wrap, placed inside reinforced 5-ply cartons with paper cushioning, and sealed with edge guards and high-visibility fragile labels.',
      },
      {
        question: 'Will your team disassemble and reassemble my bed and modular furniture?',
        answer:
          'Yes. Basic furniture disassembly (beds, dining tables, modular desks) and reassembly at the delivery location are included as standard in our household moving service.',
      },
      {
        question: 'How early should I book my household relocation?',
        answer:
          'We recommend booking 2 to 4 days ahead for local intracity relocations, and 5 to 7 days ahead for intercity long-haul moves to secure preferred truck sizes and loading slots.',
      },
      {
        question: 'Are there any items you do not transport?',
        answer:
          'For safety and legal compliance, we cannot transport hazardous chemicals, combustible liquids, gas cylinders, perishable food, jewelry, or cash. We advise customers to carry personal valuables personally.',
      },
    ],
  },

  'office-relocation': {
    id: 'office-relocation',
    title: 'Office Relocation',
    shortDescription:
      'Structured corporate transitions designed to protect servers, monitors, workstations, and files while minimizing work hours interruption.',
    iconName: 'Building2',
    features: ['IT equipment labeling', 'Weekend & overnight moving slots', 'Desk setup coordination'],
    heroTagline: 'Structured Corporate Transitions Engineered to Minimize Business Downtime',
    overview: [
      'An office move must be executed with surgical precision to avoid lost revenue, data downtime, and operational confusion. Shiftora specializes in organized commercial relocations for startups, corporate offices, clinics, and professional firms.',
      'We coordinate with your facilities and IT leadership to create a sequential floor-by-floor moving plan. Every workstation is color-coded and assigned to an individual employee number, ensuring computer towers, monitors, docks, and personal office items arrive at their exact new desk.',
      'To prevent business disruption, our crews operate during scheduled weekend windows, bank holidays, or evening hours so your staff can log off on Friday and resume work at the new facility on Monday.',
    ],
    includedItems: [
      'Anti-static bubble film and custom monitor wraps for desktop hardware',
      'Heavy-duty numbered archive crates for physical records and confidential files',
      'Color-coded workstation tagging system for rapid floor-plan reconstruction',
      'Dismantling and re-erection of conference tables, executive desks, and cubicles',
      'Dedicated on-site move supervisor managing loading dock coordination',
      'Clean transit trucks equipped with air-suspension and cargo safety bars',
    ],
    process: [
      {
        step: '01',
        title: 'Floor Plan Review & Move Blueprint',
        description:
          'We review your current office layout and destination floor blueprint to map workstation codes and sequence departments logically.',
      },
      {
        step: '02',
        title: 'Workstation & IT Hardware Tagging',
        description:
          'Each monitor, CPU, keyboard, and file crate is tagged with an employee ID and destination room code before any packing commences.',
      },
      {
        step: '03',
        title: 'Specialized Hardware & Furniture Packing',
        description:
          'IT equipment is packaged in anti-static materials; modular furniture and partitions are dismantled systematically with all hardware bagged.',
      },
      {
        step: '04',
        title: 'Synchronized Loading & Secure Transit',
        description:
          'Transit vehicles are loaded in reverse delivery order to streamline immediate offloading into designated department zones.',
      },
      {
        step: '05',
        title: 'Floor Placement & Workstation Re-Assembly',
        description:
          'Items are distributed directly to corresponding desk footprints and assembled according to the architectural layout.',
      },
    ],
    faqs: [
      {
        question: 'Can Shiftora carry out our office relocation over a weekend?',
        answer:
          'Yes. Weekend and after-hours relocations are standard practice for our corporate moving division to ensure zero interruption to normal working hours.',
      },
      {
        question: 'How do you prevent sensitive equipment and confidential documents from getting mixed up?',
        answer:
          'We enforce a color-coded and alphanumeric tagging system. Every workstation, monitor, and document crate is labeled with department and employee identifiers matching the destination floor plan.',
      },
      {
        question: 'Do your teams handle modular office cubicle dismantling?',
        answer:
          'Our crew includes modular furniture technicians experienced in dismantling and assembling partition cubicles, conference tables, and executive furniture.',
      },
    ],
  },

  'domestic-moving': {
    id: 'domestic-moving',
    title: 'Domestic Moving',
    shortDescription:
      'Scheduled intercity shifting linking major regional hubs with dedicated transit containers and progress status milestones.',
    iconName: 'Compass',
    features: ['Direct interstate freight routes', 'Pre-transit inventory audit', 'Transit checkpoint updates'],
    heroTagline: 'Dependable Interstate Relocation Connecting Key Metropolitan Corridors',
    overview: [
      'Intercity relocations demand specialized long-distance road logistics. Shiftora coordinates scheduled long-haul moves connecting our 8 verified metro hubs across India, including Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, Kolkata, and Ahmedabad.',
      'Unlike piecemeal freight transport, our domestic moving service is organized around dedicated containerized trucks, reinforced protective packaging for highway vibration, and scheduled delivery commitments.',
      'Your assigned move coordinator monitors transit milestones and communicates departure, toll corridor progress, and estimated delivery dates so you can plan your family travel with confidence.',
    ],
    includedItems: [
      'Weather-resistant containerized vehicles protecting goods from rain, dust, and wind',
      'Double-walled 5-ply cartons and heavy-duty strapping designed for highway transit',
      'Detailed pre-transit inventory audit signed jointly before departure',
      'Transit tie-down harnesses preventing cargo shifting across long highway distances',
      'Milestone updates provided during scheduled operational communication hours',
      'Door-to-door delivery with destination unloading and placement',
    ],
    process: [
      {
        step: '01',
        title: 'Route Planning & Inventory Survey',
        description:
          'We calculate transport volume, determine direct highway corridor routing, and verify access at both origin and destination cities.',
      },
      {
        step: '02',
        title: 'Highway-Grade Protective Packaging',
        description:
          'Goods receive additional reinforcement, including edge guards, stretch film, and shock-absorbing base padding.',
      },
      {
        step: '03',
        title: 'Containerized Cargo Loading',
        description:
          'Items are secured inside weather-sealed container trucks using heavy-duty ratchet straps to prevent movement during highway transit.',
      },
      {
        step: '04',
        title: 'Intercity Transit & Checkpoint Tracking',
        description:
          'Your move coordinator monitors the convoy schedule and provides milestone updates across inter-state corridors.',
      },
      {
        step: '05',
        title: 'Destination Arrival & Inventory Sign-off',
        description:
          'Our local crew handles unloading, unpacks critical items, reassembles major furniture, and completes the joint inventory verification.',
      },
    ],
    faqs: [
      {
        question: 'Which cities does Shiftora cover for domestic intercity moves?',
        answer:
          'We operate scheduled transit corridors between our 8 confirmed metropolitan hubs: Mumbai, Bengaluru, Delhi NCR, Hyderabad, Pune, Chennai, Kolkata, and Ahmedabad. If you require a move between unlisted hubs, contact our desk to check operational feasibility.',
      },
      {
        question: 'How long does an intercity move typically take?',
        answer:
          'Transit times depend on route distance and highway permits. For example, Mumbai to Pune is usually same-day/next-day, while routes like Mumbai to Bengaluru or Delhi to Hyderabad typically take 3 to 5 business days.',
      },
      {
        question: 'How are my belongings protected from rain or dust during long journeys?',
        answer:
          'All shipments travel in sealed containerized trucks with waterproof lining. Furniture and cartons are wrapped in heavy stretch wrap and protective sheeting to shield against moisture and road dust.',
      },
    ],
  },

  'car-bike-transportation': {
    id: 'car-bike-transportation',
    title: 'Car and Bike Transportation',
    shortDescription:
      'Safe vehicle transport via enclosed hydraulic car haulers and specialized two-wheeler crates with wheel-locking clamps.',
    iconName: 'Truck',
    features: ['Hydraulic ramp loading', 'Condition inspection sign-off', 'Secure tie-down harnesses'],
    heroTagline: 'Purpose-Built Vehicle Carriers with Hydraulic Decks and Wheel-Lock Clamps',
    overview: [
      'Driving your vehicle across hundreds of highway kilometers adds unnecessary wear, mileage, and travel fatigue. Shiftora provides specialized vehicle shipping for personal hatchbacks, sedans, SUVs, and two-wheelers using purpose-built automobile car carriers.',
      'Our carrier trucks feature hydraulic lifting decks, low-incline ramps, and four-point wheel tie-down clamps that secure the vehicle by its tires rather than its chassis, preventing suspension strain.',
      'Before loading, an authorized move inspector conducts a joint physical condition inspection with you, recording odometer readings, fuel status, and existing exterior marks on a written handover report.',
    ],
    includedItems: [
      'Joint pre-transit condition inspection report documenting vehicle status',
      'Hydraulic ramp loading with low-angle clearance for low-profile vehicles',
      'Four-point wheel-locking tie-down clamps and high-tension safety belts',
      'Protective seat and steering covers during loading and offloading',
      'Dedicated two-wheeler wooden/metal crating with foam wrapping for motorcycles',
      'Doorstep pickup and doorstep delivery where road dimensions permit car carrier access',
    ],
    process: [
      {
        step: '01',
        title: 'Vehicle Inspection & Joint Audit',
        description:
          'We inspect the vehicle exterior, record odometer and fuel levels, and provide a signed pre-transit condition sheet.',
      },
      {
        step: '02',
        title: 'Hydraulic Loading & Wheel Clamping',
        description:
          'Your car is carefully driven onto the hydraulic ramp and secured on the carrier deck using individual wheel-locking straps.',
      },
      {
        step: '03',
        title: 'Protected Highway Transit',
        description:
          'The carrier travels along designated logistics corridors with scheduled driver shifts to ensure safe highway progress.',
      },
      {
        step: '04',
        title: 'Destination Offloading & Delivery',
        description:
          'The vehicle is offloaded at the destination terminal and driven to your delivery address for joint inspection and handover.',
      },
    ],
    faqs: [
      {
        question: 'Can I pack personal luggage or boxes inside my car during transport?',
        answer:
          'For safety and vehicle carrier weight compliance, we strongly recommend leaving vehicles empty of personal luggage. Personal items left inside are not covered by freight carrier manifests.',
      },
      {
        question: 'What documents are required to transport my vehicle?',
        answer:
          'You will need a copy of the vehicle Registration Certificate (RC), valid insurance policy, pollution under control (PUC) certificate, and owner ID proof.',
      },
      {
        question: 'How much fuel should I leave in the tank before pickup?',
        answer:
          'Please keep approximately 10 to 15 liters of fuel (about a quarter tank). This is sufficient for driving on and off carrier ramps while minimizing fire hazard and transport weight.',
      },
    ],
  },

  'packing-unpacking': {
    id: 'packing-unpacking',
    title: 'Packing and Unpacking',
    shortDescription:
      'Specialized packing labor using heavy-gauge bubble wrap, corrugated sheets, edge guards, and optional post-move unpacking.',
    iconName: 'Package',
    features: ['Fragile item boxing', 'Numbered box inventory', 'Debris & box removal options'],
    heroTagline: 'Professional Packing Labor, Export-Grade Materials, and Destination Setup',
    overview: [
      'Proper packing is the single most critical factor in preventing damage during any move. Shiftora provides standalone packing and unpacking services for homeowners and businesses who want expert protection without compromising on materials.',
      'Our packing specialists arrive equipped with 5-ply export-grade cartons, heavy-density bubble rolls, tissue paper, corrugated roll sheets, high-adhesion tapes, and foam edge protectors.',
      'We also offer full or partial unpacking services at your destination, unboxing items, setting up wardrobe contents, and taking away empty cartons and packing debris so your new home is immediately livable.',
    ],
    includedItems: [
      'Export-grade 5-ply corrugated cardboard boxes of assorted dimensions',
      'High-grade virgin bubble wrap and stretch film for dust and moisture sealing',
      'Specialized glassware honeycomb partitions and dish-pack cartons',
      'Wardrobe boxes with hanging bars for formal clothing and suits',
      'Numbered itemized box inventory labels matching room designations',
      'Destination unboxing, shelf placement, and carton disposal service',
    ],
    process: [
      {
        step: '01',
        title: 'Material Estimation & Sorting',
        description:
          'Our packing supervisor assesses room inventory and calculates carton quantities, bubble roll footage, and specialized box needs.',
      },
      {
        step: '02',
        title: 'Fragile & Delicate Item Boxing',
        description:
          'Glassware, lamps, crockery, and picture frames are individually cushioned with multiple layers and boxed in partitioned containers.',
      },
      {
        step: '03',
        title: 'General Goods & Linen Packing',
        description:
          'Books, clothing, cookware, and linens are packed compactly in appropriately rated weight-bearing cartons.',
      },
      {
        step: '04',
        title: 'Labeling & Numbered Indexing',
        description:
          'Each box is marked with its room name, general contents summary, and numbered sequence matching your inventory list.',
      },
      {
        step: '05',
        title: 'Destination Unpacking & Debris Removal',
        description:
          'Upon delivery, our crew unboxes items, places items on designated surfaces, and removes all used cartons and packaging trash.',
      },
    ],
    faqs: [
      {
        question: 'Can I hire Shiftora solely for packing without using your transport trucks?',
        answer:
          'Yes. We offer standalone packing services with our trained crew and materials if you have your own transport or are preparing goods for long-term storage.',
      },
      {
        question: 'What materials do your packing teams bring?',
        answer:
          'Our crew arrives with complete packing equipment: 5-ply cartons, bubble wrap, stretch film, corrugated sheets, packing paper, foam corners, heavy tape, marker pens, and box cutters.',
      },
      {
        question: 'Does the unpacking service include taking away used cardboard boxes?',
        answer:
          'Yes. When you choose our full unpacking package, our crew collects all unpacked boxes, wrapping paper, and bubble wrap debris for clean disposal.',
      },
    ],
  },

  'storage-solutions': {
    id: 'storage-solutions',
    title: 'Storage Solutions',
    shortDescription:
      'Secure short-term and long-term warehousing units protected with 24/7 CCTV, pest management, and clean palletized stacking.',
    iconName: 'Warehouse',
    features: ['24/7 monitored facility', 'Flexible monthly leasing', 'Clean moisture-controlled units'],
    heroTagline: 'Clean, Secure Storage Facilities for Temporary Relocations and Household Overflows',
    overview: [
      'Whether you are renovating your home, facing a lease gap between residences, or traveling on an overseas assignment, Shiftora offers secure short-term and long-term storage solutions.',
      'Our storage warehouses feature 24/7 on-site security, continuous CCTV surveillance, regular pest control treatments, and elevated palletized stacking to prevent moisture seepage.',
      'Every item placed into our storage facility is pre-packed with storage-grade protective materials and logged on an inward warehouse receipt. You can retrieve individual items or schedule full destination delivery whenever you are ready.',
    ],
    includedItems: [
      '24/7 CCTV digital surveillance and round-the-clock physical security guards',
      'Regular pest management treatments and moisture-barrier floor pallets',
      'Individual warehouse inventory receipt and barcode item tracking',
      'Heavy-duty storage-grade bubble wrapping and plastic dust shrouds',
      'Flexible month-to-month contracts with easy duration extension',
      'Convenient retrieval and delivery to your new home upon 48 hours notice',
    ],
    process: [
      {
        step: '01',
        title: 'Storage Volume & Duration Calculation',
        description:
          'We evaluate your storage volume in cubic feet and help you select the most cost-effective storage duration and unit size.',
      },
      {
        step: '02',
        title: 'Storage-Grade Protective Wrapping',
        description:
          'Items are wrapped in specialized moisture-resistant stretch film and bubble sheets formulated for extended storage.',
      },
      {
        step: '03',
        title: 'Inventory Inward Receipt & Stacking',
        description:
          'All items are cataloged on an official warehouse receipt, barcoded, and placed on raised pallets in our secure facility.',
      },
      {
        step: '04',
        title: 'Continuous Monitoring & Maintenance',
        description:
          'Your goods remain safely secured under round-the-clock CCTV supervision with scheduled facility inspections.',
      },
      {
        step: '05',
        title: 'Coordinated Delivery on Demand',
        description:
          'When your new home is ready, simply notify our desk and we will transport and deliver your items to your new location.',
      },
    ],
    faqs: [
      {
        question: 'What is the minimum storage duration available?',
        answer:
          'Our minimum storage tenure is 1 month. After the initial month, storage is billed on a flexible monthly basis with no long-term lock-ins.',
      },
      {
        question: 'Are my goods safe from pests, dampness, and theft?',
        answer:
          'Yes. Our facilities utilize elevated pallet stacking, regular pest control treatments, waterproof wrapping, 24/7 physical security guards, and continuous CCTV surveillance.',
      },
      {
        question: 'How do I request delivery of my goods from storage?',
        answer:
          'Simply contact your move coordinator or call our hotline with 48 to 72 hours notice. We will schedule a transport vehicle and delivery crew to deliver and setup your items.',
      },
    ],
  },
};
