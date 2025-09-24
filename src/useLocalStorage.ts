// useLocalStorage.ts - Custom hook for localStorage with TypeScript

import { useState, useEffect } from 'react';

// Import types from your App.tsx
import type { City, ClockSettings, ClockDisplayMode } from './App';

// Generic type T extends any serializable type
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      // Allow value to be a function (like useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

// Type guard to check if data is a valid City array
export const isValidCityArray = (data: unknown): data is City[] => {
  if (!Array.isArray(data)) return false;
  
  return data.every(item => 
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'timezone' in item &&
    typeof item.timezone === 'object' &&
    'name' in item.timezone
  );
};

// Type guard for ClockSettings
export const isValidClockSettings = (data: unknown): data is Partial<ClockSettings> => {
  if (typeof data !== 'object' || data === null) return false;
  
  const settings = data as any;
  
  if ('displayMode' in settings) {
    if (settings.displayMode !== 'digital' && settings.displayMode !== 'analog') {
      return false;
    }
  }
  
  if ('cities' in settings) {
    return isValidCityArray(settings.cities);
  }
  
  return true;
};

export default useLocalStorage;