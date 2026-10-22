import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';

export const InternationalRelocationPage: React.FC = () => {
  useEffect(() => {
    document.title = 'International Relocation | Shiftora';
  }, []);

  const whatsappLink = 'https://wa.me/917428614678?text=' + encodeURIComponent('I am interested in International Relocation');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">International Relocation</h1>
          <p className="text-lg text-slate-700 mb-8">
            Comprehensive moving solutions across borders with customs clearance, secure packaging, and door‑to‑door delivery worldwide.
          </p>
          <ul className="list-disc list-inside text-slate-600 mb-8">
            <li>Customs documentation and clearance support</li>
            <li>International freight coordination (air, sea, road)</li>
            <li>Secure packing for long‑haul transport</li>
            <li>Destination setup assistance</li>
          </ul>
          <div className="flex gap-4 mb-8">
            <Button href={siteConfig.contact.phoneRaw} variant="primary" size="md">Call Now</Button>
            <Button href={whatsappLink} variant="outline" size="md">WhatsApp</Button>
            <Button href="#get-quote" variant="secondary" size="md">Get a Free Quote</Button>
          </div>
        </Container>
      </main>
      
    </>
  );
};
