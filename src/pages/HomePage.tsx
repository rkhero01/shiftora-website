import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrustStrip } from '../components/home/TrustStrip';
import { ServicesSection } from '../components/home/ServicesSection';
import { WhyShiftoraSection } from '../components/home/WhyShiftoraSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ServiceAreasSection } from '../components/home/ServiceAreasSection';
import { QuoteCtaSection } from '../components/home/QuoteCtaSection';

export const HomePage: React.FC = () => {
  return (
    <main>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Services */}
      <ServicesSection />

      {/* 4. Why Choose Shiftora */}
      <WhyShiftoraSection />

      {/* 5. How It Works */}
      <HowItWorksSection />

      {/* 6. Service Areas */}
      <ServiceAreasSection />

      {/* 7. Quote CTA */}
      <QuoteCtaSection />
    </main>
  );
};
