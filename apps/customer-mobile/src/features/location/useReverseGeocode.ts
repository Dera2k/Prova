import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface GeocodedAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
}

export function useReverseGeocode() {
  const [loading, setLoading] = useState(false);

  const reverseGeocode = useCallback(async (latitude: number, longitude: number): Promise<GeocodedAddress | null> => {
    setLoading(true);
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      const result = results[0];
      if (!result) return null;

      return {
        street: [result.streetNumber, result.street].filter(Boolean).join(' ') || '',
        area: result.district || result.subregion || '',
        city: result.city || '',
        state: result.region || '',
        country: result.country || 'Nigeria',
      };
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reverseGeocode, loading };
}