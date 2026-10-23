import React, { useEffect } from 'react';


import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { siteConfig } from '../config/siteConfig';
import { ServicePhoto } from '../components/common/ServicePhoto';

export const OfficeRelocationPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Office Relocation | Shiftora';
  }, []);

  const whatsappLink = 'https://wa.me/917428614678?text=' + encodeURIComponent('I am interested in Office Relocation');

  return (
    <>
      
      <main className="flex-1 py-12 bg-white text-slate-900">
        <Container className="max-w-4xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Office Relocation</h1>
          <p className="text-lg text-slate-700 mb-8">
            Professional relocation of corporate offices with minimal downtime, secure handling of IT equipment, and coordinated setup.
          </p>
          <ServicePhoto src="/images/stacked-freight-boxes.jpg" alt="Labeled shipment cartons arranged for transport" />
          <ul className="list-disc list-inside text-slate-600 mb-8">
            <li>Pre-move site survey and floor planning</li>
            <li>Secure packing of servers, monitors, and furniture</li>
            <li>Dedicated move crew with overnight options</li>
            <li>Post-move setup and unpacking assistance</li>
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
