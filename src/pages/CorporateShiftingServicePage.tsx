import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';

export const CorporateShiftingServicePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Corporate Shifting Service | Shiftora';
  }, []);

  const whatsappLink = 'https://wa.me/917428614678?text=' + encodeURIComponent('I am interested in Corporate Shifting Service');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Corporate Shifting Service</h1>
          <p className="text-lg text-slate-700 mb-8">
            Structured corporate moves designed to protect equipment, minimize downtime, and ensure a smooth transition.
          </p>
          <div className="flex space-x-4">
            <Button href={siteConfig.contact.phoneRaw} variant="primary" size="md">Call Now</Button>
            <Button href={whatsappLink} variant="secondary" size="md">WhatsApp</Button>
          </div>
        </Container>
      </main>
      
    </>
  );
};
