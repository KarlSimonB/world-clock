import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { ClockDisplayMode } from '../const/types';

export const useDisplayModes = () => {
  const [storedDisplayModes, setStoredDisplayModes] = useLocalStorage<Record<string, ClockDisplayMode>>(
    'worldClock.displayModes', 
    {}
  );

  const [cityDisplayModes, setCityDisplayModes] = useState<Record<string, ClockDisplayMode>>(storedDisplayModes);

  useEffect(() => {
    setStoredDisplayModes(cityDisplayModes);
  }, [cityDisplayModes, setStoredDisplayModes]);

  const handleToggleMode = (cityId: string, mode: ClockDisplayMode) => {
    setCityDisplayModes(prev => ({
      ...prev,
      [cityId]: mode
    }));
  };

  const setDefaultMode = (cityId: string, mode: ClockDisplayMode) => {
    setCityDisplayModes(prev => ({
      ...prev,
      [cityId]: mode
    }));
  };

  const removeMode = (cityId: string) => {
    setCityDisplayModes(prev => {
      const newModes = { ...prev };
      delete newModes[cityId];
      return newModes;
    });
  };

  return {
    cityDisplayModes,
    handleToggleMode,
    setDefaultMode,
    removeMode
  };
};