import { useState, useEffect } from 'react';
import { timeZoneService } from '../services/timeZoneService';
import { POPULAR_CITIES } from '../const/cities';

const useTimeZoneAPI = () => {
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTimezones = async () => {
      setLoading(true);
      try {
        const timezones = await timeZoneService.getAllTimezones();
        setAvailableTimezones(timezones);
      } catch (error) {
        console.error('Failed to load timezones:', error);
        setAvailableTimezones(POPULAR_CITIES.map(city => city.timezone));
      } finally {
        setLoading(false);
      }
    };

    loadTimezones();
  }, []);

  return { availableTimezones, loading };
};

export default useTimeZoneAPI;