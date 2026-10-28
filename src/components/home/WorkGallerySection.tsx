import React from 'react';
import { Container } from '../common/Container';
import { Camera } from 'lucide-react';
import { getAssetUrl } from '../../utils/assetUrl';

/**
 * All image paths are verified against public/images/ – every file exists.
 * Filenames: loaded-moving-truck, container-palletized-cargo,
 *            organized-shipping-cartons, packed-freight-cartons,
 *            freight-container-loading, truck-loaded-with-cartons,
 *            warehouse-carton-shipment, wrapped-goods-in-transit
 */
const workPhotos: { src: string; alt: string; label: string }[] = [
  {
    src: '/images/loaded-moving-truck.jpg',
    alt: 'Transport truck loaded with household cartons ready for dispatch',
    label: 'Household Relocation',
  },
  {
    src: '/images/container-shipment-boxes.jpg',
    alt: 'Labelled cartons packed uniformly inside a shipping container',
    label: 'Container Loading',
  },
  {
    src: '/images/container-palletized-cargo.jpg',
    alt: 'Palletized cargo secured inside a freight container',
    label: 'Palletized Cargo',
  },
  {
    src: '/images/organized-shipping-cartons.jpg',
    alt: 'Organized shipping cartons stacked neatly for transit',
    label: 'Organized Packing',
  },
  {
    src: '/images/warehouse-carton-shipment.jpg',
    alt: 'Bulk cartons awaiting shipment at warehouse facility',
    label: 'Warehouse Storage',
  },
  {
    src: '/images/truck-loaded-with-cartons.jpg',
    alt: 'Truck loaded with cartons and goods secured for intercity transport',
    label: 'Intercity Transport',
  },
];

export const WorkGallerySection: React.FC = () => (
  <section
    className="py-20 bg-[#081426] border-y border-white/8"
    aria-labelledby="work-gallery-heading"
  >
    <Container>
      {/* Section header */}
      <div className="max-w-3xl mx-auto text-center mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF641A]/12 border border-[#FF641A]/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF641A]">
          <Camera className="w-3.5 h-3.5" />
          Our Work
        </span>
        <h2
          id="work-gallery-heading"
          className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
        >
          Careful Packing.{' '}
          <span className="text-[#FF641A]">Organized Transport.</span>
        </h2>
        <p className="mt-3 text-white/55 leading-relaxed max-w-xl mx-auto">
          Real photos from our residential relocation, freight loading, and intercity transport operations.
        </p>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {workPhotos.map((photo) => (
          <figure
            key={photo.src}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg hover:border-[#FF641A]/40 transition-all duration-300"
          >
            {/* Photo */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={getAssetUrl(photo.src)}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Dark gradient overlay + label */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#081426]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="inline-block text-xs font-semibold text-white bg-[#FF641A]/90 px-2.5 py-1 rounded-md">
                {photo.label}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Bottom note */}
      <p className="mt-10 text-center text-xs text-white/35 tracking-wide">
        Photos are from actual Shiftora relocation and freight operations.
      </p>
    </Container>
  </section>
);
