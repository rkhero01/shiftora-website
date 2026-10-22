import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';

export const CarShiftingByCarCarrierPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Car Shifting By Car Carrier | Shiftora';
  }, []);

  const whatsappLink =
    'https://wa.me/917428614678?text=' +
    encodeURIComponent('I am interested in Car Shifting By Car Carrier');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">
            Car Shifting By Car Carrier
          </h1>
          <p className="text-lg text-slate-700 mb-8">
            Safe, door‑to‑door transport of cars using enclosed carriers, with insurance and condition inspection.
          </p>
          <ul className="list-disc list-inside text-slate-600 mb-8">
            <li>Enclosed hydraulic car carrier loading</li>
            <li>Full insurance coverage during transit</li>
            <li>Pre‑ and post‑transport condition reports</li>
            <li>Flexible timing for pickup and delivery</li>
          </ul>
          <div className="flex gap-4 mb-8">
            <Button href={siteConfig.contact.phoneRaw} variant="primary" size="md">
              Call Now
            </Button>
            <Button href={whatsappLink} variant="outline" size="md">
              WhatsApp
            </Button>
            <Button href="#get-quote" variant="secondary" size="md">
              Get a Free Quote
            </Button>
          </div>
        </Container>
      </main>
      
    </>
  );
};
