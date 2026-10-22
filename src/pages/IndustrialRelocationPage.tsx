import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';

export const IndustrialRelocationPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Industrial Relocation | Shiftora';
  }, []);

  const whatsappLink =
    'https://wa.me/917428614678?text=' +
    encodeURIComponent('I am interested in Industrial Relocation');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Industrial Relocation</h1>
          <p className="text-lg text-slate-700 mb-8">
            Specialized moving of heavy industrial equipment, machinery, and plant assets with expert rigging and safety protocols.
          </p>
          <ul className="list-disc list-inside text-slate-600 mb-8">
            <li>Custom crating and palletizing for oversized items</li>
            <li>On‑site rigging and loading experts</li>
            <li>Secure transport in reinforced trucks</li>
            <li>Re‑installation and calibration assistance</li>
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
