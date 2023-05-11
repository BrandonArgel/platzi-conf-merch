import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number, setLoading?: (loading: boolean) => void) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setLoading && setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer)
  }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps

  return debouncedValue;
}