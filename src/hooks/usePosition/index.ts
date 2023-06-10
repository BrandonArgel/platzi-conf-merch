import { useState, useEffect } from 'react';

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
};

const initialPosition: GeolocationCoordinates = {
  latitude: 0.0,
  longitude: 0.0,
  altitude: null,
  accuracy: 0,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
}

export const usePosition = (watch = false, userSettings = {}) => {
  const settings = {
    ...defaultSettings,
    ...userSettings,
  };

  const [position, setPosition] = useState(initialPosition);
  const [error, setError] = useState<string>("");

  const onChange = ({ coords }: GeolocationPosition) => {
    setPosition({
      ...coords,
    });
  };

  const onError = (error: any) => {
    setError(error.message);
  };

  useEffect(() => {
    if (!navigator || !navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    if (watch) {
      const watcher =
        navigator.geolocation.watchPosition(onChange, onError, settings);
      return () => navigator.geolocation.clearWatch(watcher);
    }

    navigator.geolocation.getCurrentPosition(onChange, onError, settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.enableHighAccuracy,
    settings.timeout,
    settings.maximumAge
  ]);

  return { ...position, error };
};