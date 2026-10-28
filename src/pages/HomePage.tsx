import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { TrustStrip } from '../components/home/TrustStrip';
import { ServicesSection } from '../components/home/ServicesSection';
import { WhyShiftoraSection } from '../components/home/WhyShiftoraSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ServiceAreasSection } from '../components/home/ServiceAreasSection';
import { QuoteCtaSection } from '../components/home/QuoteCtaSection';
import { WorkGallerySection } from '../components/home/WorkGallerySection';

export const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <main>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Services */}
      <ServicesSection />

      {/* Real relocation and freight work photos */}
      <WorkGallerySection />

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
