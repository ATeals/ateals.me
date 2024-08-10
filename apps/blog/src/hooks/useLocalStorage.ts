"use client";

import { useEffect, useState } from "react";

const getStoredValue = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : undefined;
};

interface StorageOptions<T> {
  initialValue?: T;
}

export const useLocalStorage = <T>(key: string, option: StorageOptions<T> = {}) => {
  const [value, setValue] = useState(() => getStoredValue(key) || option.initialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};
