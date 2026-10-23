import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';
import { ServicePhoto } from '../components/common/ServicePhoto';

export const SeaFreightPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Sea Freight | Shiftora';
  }, []);

  const whatsappLink =
    'https://wa.me/917428614678?text=' +
    encodeURIComponent('I am interested in Sea Freight');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Sea Freight</h1>
          <p className="text-lg text-slate-700 mb-8">
            Cost‑effective ocean shipping for large shipments, containers, or bulk cargo with full tracking and customs support.
          </p>
          <ServicePhoto src="/images/freight-container-loading.jpg" alt="Palletized cargo arranged inside a shipping container" />
          <ul className="list-disc list-inside text-slate-600 mb-8">
            <li>Full‑container load (FCL) and less‑than‑container load (LCL) options</li>
            <li>Port‑to‑port and door‑to‑door services</li>
            <li>Customs clearance and documentation handling</li>
            <li>Real‑time vessel tracking and ETA notifications</li>
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
