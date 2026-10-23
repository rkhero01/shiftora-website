import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';
import { ServicePhoto } from '../components/common/ServicePhoto';

export const RoadFreightPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Road Freight | Shiftora';
  }, []);

  const whatsappLink =
    'https://wa.me/917428614678?text=' +
    encodeURIComponent('I am interested in Road Freight');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Road Freight</h1>
          <p className="text-lg text-slate-700 mb-8">
            Reliable overland cargo transport for pallets, crates, and bulk goods across the country.
          </p>
          <ServicePhoto src="/images/truck-loaded-with-cartons.jpg" alt="Transport truck loaded with secured cartons" />
          <ul className="list-disc list-inside text-slate-600 mb-8">
            <li>Door‑to‑door pickup and delivery</li>
            <li>Real‑time GPS tracking of trucks</li>
            <li>Flexible load sizes, from LTL to full‑truckload</li>
            <li>Professional handling and secure loading</li>
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
