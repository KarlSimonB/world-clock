import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { City, CityData } from '../const/types';
import { getCityImageUrl } from '../const/images';

export const useCityManager = () => {
  const [storedCities, setStoredCities] = useLocalStorage<City[]>('worldClock.cities', []);
  const [cities, setCities] = useState<City[]>(storedCities);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setStoredCities(cities);
  }, [cities, setStoredCities]);

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
        displayName: cityData.timezone.replace(/_/g, ' ')
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