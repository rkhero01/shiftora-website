export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface BusinessContact {
  phoneDisplay: string;
  phoneRaw: string;
  email: string;
  operatingHours: string;
  addressSummary: string;
}

export interface ServiceArea {
  name: string;
  stateOrRegion: string;
  popular?: boolean;
}

export interface ServiceOffering {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  features: string[];
}

export interface ServiceStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetail extends ServiceOffering {
  heroTagline: string;
  overview: string[];
  process: ServiceStep[];
  includedItems: string[];
  faqs: ServiceFaq[];
}

export interface TrustPillar {
  title: string;
  description: string;
  iconName: string;
}

export interface SiteConfig {
  brandName: string;
  legalEntityName: string;
  tagline: string;
  description: string;
  contact: BusinessContact;
  serviceAreas: ServiceArea[];
  services: ServiceOffering[];
  trustPillars: TrustPillar[];
  navigation: NavItem[];
}
