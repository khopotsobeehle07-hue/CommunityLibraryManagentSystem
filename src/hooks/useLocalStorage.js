import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue, mergeStoredValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initialValue;

      const parsed = JSON.parse(stored);
      const migrationComplete = localStorage.getItem(`${key}:migration-complete`) === "true";
      return mergeStoredValue && !migrationComplete
        ? mergeStoredValue(parsed, initialValue)
        : parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    if (mergeStoredValue) {
      localStorage.setItem(`${key}:migration-complete`, "true");
    }
  }, [key, value, mergeStoredValue]);

  return [value, setValue];
}