import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';
import { ServicePhoto } from '../components/common/ServicePhoto';

export const ResidentialRelocationPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Residential Relocation | Shiftora';
  }, []);

  return (
    <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Residential Relocation</h1>
          <p className="text-lg text-slate-700 mb-8">
            Seamless home moving experience with multi‑layer packing, careful handling, and door‑to‑door service.
          </p>
          <ServicePhoto src="/images/packed-freight-cartons.jpg" alt="Packed and protected cartons prepared for a relocation shipment" />
          <Button href={siteConfig.contact.phoneRaw} variant="primary" size="md">Call Now</Button>
        </Container>
      </main>
  );
};
