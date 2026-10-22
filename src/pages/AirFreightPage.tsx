import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';

export const AirFreightPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Air Freight | Shiftora';
  }, []);

  const whatsappLink =
    'https://wa.me/917428614678?text=' +
    encodeURIComponent('I am interested in Air Freight');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Air Freight</h1>
          <p className="text-lg text-slate-700 mb-8">
            Fast and reliable air freight services for urgent shipments, with door-to-door handling and customs clearance.
          </p>
          <ul className="list-disc list-inside text-slate-600 mb-8">
            <li>Express air cargo for time‑critical items</li>
            <li>Secure packaging and lightweight handling</li>
            <li>Integrated customs documentation</li>
            <li>Real‑time tracking and delivery notifications</li>
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
