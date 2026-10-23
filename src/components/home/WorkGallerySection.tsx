import React from 'react';
import { Container } from '../common/Container';

const workPhotos = [
  { src: '/images/loaded-moving-truck.jpg', alt: 'Transport truck loaded with cartons ready for dispatch' },
  { src: '/images/container-palletized-cargo.jpg', alt: 'Palletized cargo secured inside a freight container' },
  { src: '/images/organized-shipping-cartons.jpg', alt: 'Organized shipping cartons stacked for transit' },
  { src: '/images/packed-freight-cartons.jpg', alt: 'Protected cartons prepared for a relocation shipment' },
  { src: '/images/freight-container-loading.jpg', alt: 'Cargo arranged inside a shipping container' },
  { src: '/images/truck-loaded-with-cartons.jpg', alt: 'Loaded truck with cartons secured for transport' },
];

export const WorkGallerySection: React.FC = () => (
  <section className="py-20 bg-slate-50 border-y border-slate-100" aria-labelledby="work-gallery-heading">
    <Container>
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
          Our Work
        </span>
        <h2 id="work-gallery-heading" className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Careful Packing. Organized Transport.
        </h2>
        <p className="mt-3 text-slate-600 leading-relaxed">
          A look at cargo preparation and loading from our relocation and freight work.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {workPhotos.map((photo) => (
          <figure key={photo.src} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </figure>
        ))}
      </div>
    </Container>
  </section>
);
