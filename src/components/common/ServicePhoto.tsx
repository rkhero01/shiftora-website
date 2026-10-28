import React from 'react';
import { getAssetUrl } from '../../utils/assetUrl';

type ServicePhotoProps = {
  src: string;
  alt: string;
};

export const ServicePhoto: React.FC<ServicePhotoProps> = ({ src, alt }) => (
  <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
    <img
      src={getAssetUrl(src)}
      alt={alt}
      className="block w-full max-h-[460px] object-cover object-center"
      loading="lazy"
      decoding="async"
    />
  </figure>
);
