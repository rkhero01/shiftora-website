import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';
import { ServicePhoto } from '../components/common/ServicePhoto';

export const DoorToDoorRelocationPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Door To Door Relocation | Shiftora';
  }, []);

  const whatsappLink = 'https://wa.me/917428614678?text=' + encodeURIComponent('I am interested in Door To Door Relocation');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Door To Door Relocation</h1>
          <p className="text-lg text-slate-700 mb-8">
            Comprehensive end‑to‑end moving service from origin to destination, handling all logistics.
          </p>
          <ServicePhoto src="/images/loaded-moving-truck.jpg" alt="Goods loaded into a transport truck for delivery" />
          <div className="flex space-x-4">
            <Button href={siteConfig.contact.phoneRaw} variant="primary" size="md">Call Now</Button>
            <Button href={whatsappLink} variant="outline" size="md">WhatsApp</Button>
          </div>
        </Container>
      </main>
      
    </>
  );
};

