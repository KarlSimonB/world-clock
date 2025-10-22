import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { City, CityData } from '../const/types';
import { POPULAR_CITIES } from '../const/cities';
import { getCityImageUrl } from '../const/images';

export const useCityManager = () => {
  const [storedCities, setStoredCities] = useLocalStorage<City[]>('worldClock.cities', []);
  const [cities, setCities] = useState<City[]>(storedCities);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setStoredCities(cities);
  }, [cities, setStoredCities]);

  useEffect(() => {
    if (storedCities.length === 0 && cities.length === 0) {
      initializeCities();
    }
  }, [storedCities.length, cities.length]);

  const initializeCities = async () => {
    const initialCities: City[] = POPULAR_CITIES.slice(0, 2).map(cityData => ({
      id: cityData.name.toLowerCase(),
      name: cityData.name.toUpperCase(),
      country: cityData.country,
      countryCode: cityData.countryCode,
      timezone: {
        name: cityData.timezone,
        offset: '', // Not needed - using timezone name instead
        displayName: cityData.timezone.replace('_', ' ')
      },
      imageUrl: getCityImageUrl(cityData.name)
    }));
    setCities(initialCities);
  };

  const handleAddCity = (city: City) => {
    setCities(prev => [...prev, city]);
  };

  const handleQuickAddCity = async (cityData: CityData) => {
    if (cities.some(city => city.timezone.name === cityData.timezone)) {
      alert('City already added!');
      return;
    }

    if (cities.length >= 9) {
      alert('Maximum 9 cities allowed!');
      return;
    }

    const newCity: City = {
      id: `${cityData.name.toLowerCase()}-${Date.now()}`,
      name: cityData.name.toUpperCase(),
      country: cityData.country,
      countryCode: cityData.countryCode,
      timezone: {
        name: cityData.timezone,
        offset: '',
        displayName: cityData.timezone.replace('_', ' ')
      },
      imageUrl: getCityImageUrl(cityData.name)
    };
    
    handleAddCity(newCity);
    setSearchQuery('');
  };

  const handleRemoveCity = (cityId: string) => {
    setCities(prev => prev.filter(city => city.id !== cityId));
  };

  return {
    cities,
    searchQuery,
    setSearchQuery,
    handleAddCity,
    handleQuickAddCity,
    handleRemoveCity,
    setCities
  };
};