import { useState, useEffect } from 'react';
import axios from 'axios';
import { PositionModel } from "@models";

const BASE_API = 'https://maps.googleapis.com/maps/api/geocode/json';

export const useGoogleAddress = (address: string, city: string) => {
  const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;
  const [location, setLocation] = useState<PositionModel>({ lat: 0, lng: 0 });

  useEffect(() => {
    if (!address || !city) return;
    const getGeolocation = async () => {
      try {
        const response = await axios(`${BASE_API}?address=${address} ${city}&key=${VITE_GOOGLE_MAPS_API_KEY}`);
        setLocation(response.data.results[0].geometry.location);
      } catch (error) {
        console.log(error);
      }
    }

    getGeolocation();
  }, [address, city]); // eslint-disable-line react-hooks/exhaustive-deps

  return location;
};