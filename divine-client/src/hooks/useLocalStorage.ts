"use client";

import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): {
  data: T;
  setData: (newValue: T) => void;
  isHydrated: boolean;
  clear: () => void;
} => {
  const [data, setData] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  const setDataWrapper = useCallback<(newValue: T) => void>((newValue) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));

      setData(newValue);
    } catch (error) {
      console.error(`error setting localStorage key - ${key}:`, error);
    }
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(key);

    setData(initialValue);
  }, []);

  const parseJson = useCallback<(value: string) => T>(
    (value) => {
      let parsed: unknown;

      try {
        parsed = JSON.parse(value);
      } catch (error) {
        console.error("error parsing JSON:", error);
        return initialValue;
      }

      return parsed as T;
    },
    [initialValue]
  );

  const read = useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? parseJson(raw) : initialValue;
    } catch (error) {
      console.warn(`error reading localStorage key - ${key}:`, error);
      return initialValue;
    }
  }, [initialValue, key, parseJson]);

  useEffect(() => {
    setData(read());
    setIsHydrated(true);
  }, [key]);

  return {
    data,
    setData: setDataWrapper,
    isHydrated,
    clear,
  };
};
