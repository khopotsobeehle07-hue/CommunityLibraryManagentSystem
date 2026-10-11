import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue, mergeStoredValue, migrationVersion) {
  const migrationKey = migrationVersion
    ? `${key}:migration-complete:${migrationVersion}`
    : `${key}:migration-complete`;

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return initialValue;

      const parsed = JSON.parse(stored);
      const migrationComplete = localStorage.getItem(migrationKey) === "true";
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
      localStorage.setItem(migrationKey, "true");
    }
  }, [key, value, mergeStoredValue, migrationKey]);

  return [value, setValue];
}