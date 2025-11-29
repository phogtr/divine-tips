// https://usehooks-ts.com/react-hook/use-local-storage
// modified of the original

"use client";

import { useCallback, useEffect, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

import { useEventCallback } from "@/hooks/lib/useEventCallback";
import { useEventListener } from "@/hooks/lib/useEventListener";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  isHydrated: boolean;
  clear: () => void;
} => {
  const [data, setData] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  const setDataWrapper: Dispatch<SetStateAction<T>> = useEventCallback(
    (newValue) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(newValue));

        setData(newValue);

        // We dispatch a custom event so every similar useLocalStorage hook is notified
        window.dispatchEvent(new StorageEvent("local-storage", { key }));
      } catch (error) {
        console.error(`error setting localStorage key - ${key}:`, error);
      }
    }
  );

  const clear = useEventCallback(() => {
    window.localStorage.removeItem(key);

    setData(initialValue);

    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  });

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

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return;
      }
      setData(read());
    },
    [key, read]
  );

  // this only works for other documents, not the current one
  useEventListener("storage", handleStorageChange);

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener("local-storage", handleStorageChange);

  return {
    data,
    setData: setDataWrapper,
    isHydrated,
    clear,
  };
};
