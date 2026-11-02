import { useState, useEffect } from 'react';
import {
  FALLBACK_CITY,
  detectVisitorCity,
  formatLocationLabel,
  getCachedVisitorCity,
} from '../utils/visitorLocation';

export interface VisitorCityState {
  city: string;
  locationLabel: string;
  isLoading: boolean;
}

export function useVisitorCity(): VisitorCityState {
  const initialCached = getCachedVisitorCity();
  const [city, setCity] = useState<string>(initialCached ?? FALLBACK_CITY);
  const [isLoading, setIsLoading] = useState<boolean>(initialCached === null);

  useEffect(() => {
    let isMounted = true;

    const cached = getCachedVisitorCity();
    if (cached) {
      setCity(cached);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    detectVisitorCity()
      .then((detected) => {
        if (isMounted) {
          setCity(detected);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCity(FALLBACK_CITY);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    city,
    locationLabel: formatLocationLabel(city),
    isLoading,
  };
}

