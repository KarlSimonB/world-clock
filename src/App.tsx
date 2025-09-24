// Imports, Types, and Constants
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Search, Plus, X } from 'lucide-react';
import './App.css';
import useLocalStorage from './useLocalStorage';
import CityDetail from './CityDetail';

// Interfaces
interface TimeZone {
  name: string;
  offset: string;
  displayName: string;
}

interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  timezone: TimeZone;
  imageUrl: string;
}

interface ClockSettings {
  displayMode: 'digital' | 'analog';
  cities: City[];
}

type ClockDisplayMode = 'digital' | 'analog';

// Export types
export type { City, ClockSettings, ClockDisplayMode, TimeZone };

// API Types
interface TimeZoneInfo {
  timezone: string;
  utc_offset: string;
  datetime: string;
  day_of_year: number;
}

interface CityData {
  name: string;
  country: string;
  countryCode: string;
  timezone: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

// WorldTimeAPI service with HTTPS
const timeZoneService = {
  async getTimeZone(timezone: string): Promise<TimeZoneInfo> {
    try {
      const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
      if (!response.ok) throw new Error('Failed to fetch timezone');
      return await response.json();
    } catch (error) {
      console.error('Error fetching timezone:', error);
      return this.getFallbackTimeZone(timezone);
    }
  },

  async getAllTimezones(): Promise<string[]> {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone');
      if (!response.ok) throw new Error('Failed to fetch timezones');
      return await response.json();
    } catch (error) {
      console.error('Error fetching timezones:', error);
      return this.getFallbackTimezones();
    }
  },

  getFallbackTimeZone(timezone: string): TimeZoneInfo {
    const timezoneOffsets: Record<string, string> = {
      'Europe/Stockholm': '+01:00',
      'Asia/Tokyo': '+09:00',
      'America/New_York': '-05:00',
      'Europe/London': '+00:00',
      'Australia/Sydney': '+11:00',
      'Asia/Dubai': '+04:00',
      'America/Los_Angeles': '-08:00',
      'Europe/Paris': '+01:00',
      'Asia/Singapore': '+08:00',
      'Europe/Moscow': '+03:00',
      'Asia/Hong_Kong': '+08:00',
      'Asia/Kolkata': '+05:30'
    };

    return {
      timezone: timezone,
      utc_offset: timezoneOffsets[timezone] || '+00:00',
      datetime: new Date().toISOString(),
      day_of_year: Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    };
  },

  getFallbackTimezones(): string[] {
    return [
      'Europe/Stockholm',
      'Asia/Tokyo', 
      'America/New_York',
      'Europe/London',
      'Australia/Sydney',
      'Asia/Dubai',
      'America/Los_Angeles',
      'Europe/Paris',
      'Asia/Singapore',
      'Europe/Moscow',
      'Asia/Hong_Kong',
      'Asia/Kolkata',
      'America/Chicago',
      'Europe/Berlin',
      'Asia/Shanghai',
      'America/Toronto',
      'Europe/Rome',
      'Asia/Bangkok',
      'America/Mexico_City',
      'Pacific/Auckland'
    ];
  }
};

// Popular cities data
const POPULAR_CITIES: CityData[] = [
  {
    name: 'Stockholm',
    country: 'Sweden',
    countryCode: 'SE',
    timezone: 'Europe/Stockholm',
    coordinates: { lat: 59.3293, lon: 18.0686 }
  },
  {
    name: 'Tokyo',
    country: 'Japan', 
    countryCode: 'JP',
    timezone: 'Asia/Tokyo',
    coordinates: { lat: 35.6762, lon: 139.6503 }
  },
  {
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    timezone: 'America/New_York',
    coordinates: { lat: 40.7128, lon: -74.0060 }
  },
  {
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    timezone: 'Europe/London',
    coordinates: { lat: 51.5074, lon: -0.1278 }
  },
  {
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    timezone: 'Australia/Sydney',
    coordinates: { lat: -33.8688, lon: 151.2093 }
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    timezone: 'Asia/Dubai',
    coordinates: { lat: 25.2048, lon: 55.2708 }
  },
  {
    name: 'Los Angeles',
    country: 'United States',
    countryCode: 'US',
    timezone: 'America/Los_Angeles',
    coordinates: { lat: 34.0522, lon: -118.2437 }
  },
  {
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    timezone: 'Europe/Paris',
    coordinates: { lat: 48.8566, lon: 2.3522 }
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    timezone: 'Asia/Singapore',
    coordinates: { lat: 1.3521, lon: 103.8198 }
  },
  {
    name: 'Moscow',
    country: 'Russia',
    countryCode: 'RU',
    timezone: 'Europe/Moscow',
    coordinates: { lat: 55.7558, lon: 37.6176 }
  },
  {
    name: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    timezone: 'Europe/Berlin',
    coordinates: { lat: 52.5200, lon: 13.4050 }
  },
  {
    name: 'Shanghai',
    country: 'China',
    countryCode: 'CN',
    timezone: 'Asia/Shanghai',
    coordinates: { lat: 31.2304, lon: 121.4737 }
  },
];

// Images
const CITY_IMAGES: Record<string, string> = {
  'stockholm': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=300&fit=crop&auto=format',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&auto=format',
  'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&auto=format',
  'moscow': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400&h=300&fit=crop&auto=format',
  'berlin': 'https://images.unsplash.com/photo-1587330979470-3829d21c8c4e?w=400&h=300&fit=crop&auto=format',
  'rome': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop&auto=format',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&auto=format',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop&auto=format',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop&auto=format',
  'hong kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=300&fit=crop&auto=format',
  'mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&auto=format',
  'bangkok': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop&auto=format',
  'shanghai': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400&h=300&fit=crop&auto=format',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop&auto=format',
  'los angeles': 'https://images.unsplash.com/photo-1444723121911-77bbc3ee3327?w=400&h=300&fit=crop&auto=format',
  'chicago': 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=400&h=300&fit=crop&auto=format',
  'toronto': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop&auto=format',
  'mexico city': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400&h=300&fit=crop&auto=format',
  'sydney': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
  'auckland': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=300&fit=crop&auto=format',
  'default': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop&auto=format'
};

const getCityImageUrl = (cityName: string): string => {
  const key = cityName.toLowerCase();
  return CITY_IMAGES[key] || CITY_IMAGES['default'];
};

const formatTimezoneOffset = (offset: string): string => {
  if (!offset) return '+0';
  return offset.replace(':00', '');
};

// UTC offset

const UTC_OFFSETS = [
  { value: '-12:00', label: 'UTC-12:00' },
  { value: '-11:00', label: 'UTC-11:00' },
  { value: '-10:00', label: 'UTC-10:00' },
  { value: '-09:30', label: 'UTC-09:30' },
  { value: '-09:00', label: 'UTC-09:00' },
  { value: '-08:00', label: 'UTC-08:00' },
  { value: '-07:00', label: 'UTC-07:00' },
  { value: '-06:00', label: 'UTC-06:00' },
  { value: '-05:00', label: 'UTC-05:00' },
  { value: '-04:00', label: 'UTC-04:00' },
  { value: '-03:30', label: 'UTC-03:30' },
  { value: '-03:00', label: 'UTC-03:00' },
  { value: '-02:00', label: 'UTC-02:00' },
  { value: '-01:00', label: 'UTC-01:00' },
  { value: '+00:00', label: 'UTC+00:00' },
  { value: '+01:00', label: 'UTC+01:00' },
  { value: '+02:00', label: 'UTC+02:00' },
  { value: '+03:00', label: 'UTC+03:00' },
  { value: '+03:30', label: 'UTC+03:30' },
  { value: '+04:00', label: 'UTC+04:00' },
  { value: '+04:30', label: 'UTC+04:30' },
  { value: '+05:00', label: 'UTC+05:00' },
  { value: '+05:30', label: 'UTC+05:30' },
  { value: '+05:45', label: 'UTC+05:45' },
  { value: '+06:00', label: 'UTC+06:00' },
  { value: '+06:30', label: 'UTC+06:30' },
  { value: '+07:00', label: 'UTC+07:00' },
  { value: '+08:00', label: 'UTC+08:00' },
  { value: '+08:30', label: 'UTC+08:30' },
  { value: '+08:45', label: 'UTC+08:45' },
  { value: '+09:00', label: 'UTC+09:00' },
  { value: '+09:30', label: 'UTC+09:30' },
  { value: '+10:00', label: 'UTC+10:00' },
  { value: '+10:30', label: 'UTC+10:30' },
  { value: '+11:00', label: 'UTC+11:00' },
  { value: '+12:00', label: 'UTC+12:00' },
  { value: '+12:45', label: 'UTC+12:45' },
  { value: '+13:00', label: 'UTC+13:00' },
  { value: '+14:00', label: 'UTC+14:00' }
];

// Custom hook for timezone API

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

// Custom hook for current time
const useCurrentTime = (timezone: string) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return time;
};

// Analog Clock Component
const AnalogClock: React.FC<{ 
  time: Date; 
  timezone: string; 
  size?: number 
}> = ({ time, timezone, size = 80 }) => {
  
  const getTimezoneTime = (date: Date, tz: string): Date => {
    if (tz.startsWith('UTC')) {
      const offset = tz.replace('UTC', '');
      const offsetHours = parseFloat(offset) || 0;
      const offsetMinutes = (Math.abs(offsetHours) % 1) * 60;
      const totalOffsetMinutes = Math.floor(offsetHours) * 60 + (offsetHours >= 0 ? offsetMinutes : -offsetMinutes);
      
      const utcTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      return new Date(utcTime.getTime() + totalOffsetMinutes * 60000);
    } else {
      try {
        return new Date(date.toLocaleString('en-US', { timeZone: tz }));
      } catch (error) {
        console.error('Invalid timezone:', tz);
        return date;
      }
    }
  };

  const timezoneTime = getTimezoneTime(time, timezone);
  
  const hours = timezoneTime.getHours() % 12;
  const minutes = timezoneTime.getMinutes();
  const seconds = timezoneTime.getSeconds();

  const hourAngle = (hours * 30) + (minutes * 0.5) - 90;
  const minuteAngle = (minutes * 6) - 90;

  const hourX = (size / 2) + (size * 0.25) * Math.cos(hourAngle * Math.PI / 180);
  const hourY = (size / 2) + (size * 0.25) * Math.sin(hourAngle * Math.PI / 180);
  
  const minuteX = (size / 2) + (size * 0.35) * Math.cos(minuteAngle * Math.PI / 180);
  const minuteY = (size / 2) + (size * 0.35) * Math.sin(minuteAngle * Math.PI / 180);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="black"
          stroke="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          fill="white"
          stroke="black"
          strokeWidth="1"
        />
        
        <line
          x1={size / 2}
          y1={size / 2}
          x2={hourX}
          y2={hourY}
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        <line
          x1={size / 2}
          y1={size / 2}
          x2={minuteX}
          y2={minuteY}
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r="3"
          fill="black"
        />
      </svg>
    </div>
  );
};

// Add City Modal Component
const AddCityModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (city: City) => void;
}> = ({ isOpen, onClose, onAddCity }) => {
  const [mode, setMode] = useState<'popular' | 'custom'>('popular');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [customUTCOffset, setCustomUTCOffset] = useState('');
  const [customCityName, setCustomCityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCity = async () => {
    setIsLoading(true);
    try {
      if (mode === 'popular' && selectedCity) {
        let timeInfo;
        try {
          timeInfo = await timeZoneService.getTimeZone(selectedCity.timezone);
        } catch (error) {
          timeInfo = timeZoneService.getFallbackTimeZone(selectedCity.timezone);
        }
        
        const newCity: City = {
          id: `${selectedCity.name.toLowerCase()}-${Date.now()}`,
          name: selectedCity.name.toUpperCase(),
          country: selectedCity.country,
          countryCode: selectedCity.countryCode,
          timezone: {
            name: selectedCity.timezone,
            offset: formatTimezoneOffset(timeInfo.utc_offset),
            displayName: selectedCity.timezone.replace('_', ' ')
          },
          imageUrl: getCityImageUrl(selectedCity.name)
        };
        onAddCity(newCity);
      } else if (mode === 'custom' && customUTCOffset && customCityName) {
        const newCity: City = {
          id: `${customCityName.toLowerCase()}-${Date.now()}`,
          name: customCityName.toUpperCase(),
          country: 'Custom',
          countryCode: 'XX',
          timezone: {
            name: `UTC${customUTCOffset}`,
            offset: formatTimezoneOffset(customUTCOffset),
            displayName: `UTC${customUTCOffset}`
          },
          imageUrl: getCityImageUrl(customCityName)
        };
        onAddCity(newCity);
      }
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error adding city:', error);
      alert('Failed to add city. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSearchTerm('');
    setSelectedCity(null);
    setCustomUTCOffset('');
    setCustomCityName('');
    setMode('popular');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New City</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="mode-toggle-container">
            <button
              onClick={() => setMode('popular')}
              className={`mode-toggle-btn ${mode === 'popular' ? 'active' : ''}`}
            >
              POPULAR
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`mode-toggle-btn ${mode === 'custom' ? 'active' : ''}`}
            >
              CUSTOM
            </button>
          </div>

          {mode === 'popular' ? (
            <div className="section">
              <h3>Popular Cities</h3>
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              <div className="cities-list">
                {filteredCities.map(city => (
                  <div
                    key={`${city.name}-${city.countryCode}`}
                    className={`city-option ${selectedCity?.name === city.name ? 'selected' : ''}`}
                    onClick={() => setSelectedCity(city)}
                  >
                    <div>
                      <span className="city-name">{city.name}, {city.country}</span>
                      <span className="timezone-info">{city.timezone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="section">
              <h3>Add Custom City</h3>
              <input
                type="text"
                placeholder="Enter city name..."
                value={customCityName}
                onChange={(e) => setCustomCityName(e.target.value)}
                className="search-input"
              />
              
              <select
                value={customUTCOffset}
                onChange={(e) => setCustomUTCOffset(e.target.value)}
                className="timezone-select"
              >
                <option value="">Select UTC offset...</option>
                {UTC_OFFSETS.map(offset => (
                  <option key={offset.value} value={offset.value}>{offset.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button 
            className="add-btn"
            onClick={handleAddCity} 
            disabled={
              (mode === 'popular' && !selectedCity) || 
              (mode === 'custom' && (!customUTCOffset || !customCityName)) || 
              isLoading
            }
          >
            {isLoading ? 'Adding...' : 'Add City'}
          </button>
        </div>
      </div>
    </div>
  );
};

// City Card Component
const CityCard: React.FC<{
  city: City;
  displayMode: ClockDisplayMode;
  onToggleMode: (cityId: string, mode: ClockDisplayMode) => void;
  onRemove: (cityId: string) => void;
}> = ({ city, displayMode, onToggleMode, onRemove }) => {
  const navigate = useNavigate();
  const currentTime = useCurrentTime(city.timezone.name);
  
  const formatTime = (date: Date): string => {
    if (city.timezone.name.startsWith('UTC')) {
      const offset = city.timezone.offset;
      const offsetHours = parseInt(offset.replace('+', '')) || 0;
      const offsetMinutes = (parseFloat(offset.replace('+', '')) % 1) * 60;
      
      const utcTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const localTime = new Date(utcTime.getTime() + (offsetHours * 60 + offsetMinutes) * 60000);
      
      return localTime.toLocaleTimeString('sv-SE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    
    return date.toLocaleTimeString('sv-SE', {
      timeZone: city.timezone.name,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/city/${city.id}`);
  };

  return (
    <div className="city-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div 
        className="city-card-bg"
        style={{ backgroundImage: `url(${city.imageUrl})` }}
      >
        <div className="city-card-overlay"></div>
      </div>
      
      <div className="city-card-content">
        <div className="city-header">
          <h3 className="city-name">
            {city.name} {city.countryCode}
          </h3>
          <button 
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(city.id);
            }}
            title="Remove city"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="toggle-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMode(city.id, 'analog');
            }}
            className={`toggle-btn ${displayMode === 'analog' ? 'active' : ''}`}
          >
            ANALOG
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMode(city.id, 'digital');
            }}
            className={`toggle-btn ${displayMode === 'digital' ? 'active' : ''}`}
          >
            DIGITAL
          </button>
        </div>
        
        <div className="time-display">
          {displayMode === 'digital' ? (
            <div className="digital-time">
              <div className="time-text">
                {formatTime(currentTime)}
              </div>
              <div className="gmt-text">
                GMT {city.timezone.offset}
              </div>
            </div>
          ) : (
            <div className="analog-time">
              <AnalogClock 
                time={currentTime} 
                timezone={city.timezone.name} 
                size={80} 
              />
              <div className="gmt-text">
                GMT {city.timezone.offset}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add City Placeholder
const AddCityCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="add-city-card" onClick={onClick}>
    <Plus size={48} />
  </div>
);


// Main World Clock App Component
const WorldClockApp: React.FC = () => {
  // Use localStorage hooks
  const [storedCities, setStoredCities] = useLocalStorage<City[]>('worldClock.cities', []);
  const [storedDisplayModes, setStoredDisplayModes] = useLocalStorage<Record<string, ClockDisplayMode>>(
    'worldClock.displayModes', 
    {}
  );

  const [cities, setCities] = useState<City[]>(storedCities);
  const [cityDisplayModes, setCityDisplayModes] = useState<Record<string, ClockDisplayMode>>(storedDisplayModes);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Update localStorage
  useEffect(() => {
    setStoredCities(cities);
  }, [cities, setStoredCities]);

  // Update localStorage whenever display modes change
  useEffect(() => {
    setStoredDisplayModes(cityDisplayModes);
  }, [cityDisplayModes, setStoredDisplayModes]);

  // Initialize with sample cities if no localstorage
  useEffect(() => {
    if (storedCities.length === 0 && cities.length === 0) {
      const initializeCities = async () => {
        const initialCities: City[] = [];
        
        for (const cityData of POPULAR_CITIES.slice(0, 2)) {
          try {
            let timeInfo;
            try {
              timeInfo = await timeZoneService.getTimeZone(cityData.timezone);
            } catch (error) {
              timeInfo = timeZoneService.getFallbackTimeZone(cityData.timezone);
            }
            
            initialCities.push({
              id: cityData.name.toLowerCase(),
              name: cityData.name.toUpperCase(),
              country: cityData.country,
              countryCode: cityData.countryCode,
              timezone: {
                name: cityData.timezone,
                offset: formatTimezoneOffset(timeInfo.utc_offset),
                displayName: cityData.timezone.replace('_', ' ')
              },
              imageUrl: getCityImageUrl(cityData.name)
            });
          } catch (error) {
            console.error(`Failed to load ${cityData.name}:`, error);
          }
        }
        
        setCities(initialCities);
        setCityDisplayModes({
          stockholm: 'digital',
          tokyo: 'analog'
        });
      };

      initializeCities();
    }
  }, []);

  const handleToggleMode = (cityId: string, mode: ClockDisplayMode) => {
    setCityDisplayModes(prev => ({
      ...prev,
      [cityId]: mode
    }));
  };

  const handleAddCity = (city: City) => {
    setCities(prev => [...prev, city]);
    setCityDisplayModes(prev => ({
      ...prev,
      [city.id]: 'digital'
    }));
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

    try {
      let timeInfo;
      try {
        timeInfo = await timeZoneService.getTimeZone(cityData.timezone);
      } catch (error) {
        timeInfo = timeZoneService.getFallbackTimeZone(cityData.timezone);
      }
      
      const newCity: City = {
        id: `${cityData.name.toLowerCase()}-${Date.now()}`,
        name: cityData.name.toUpperCase(),
        country: cityData.country,
        countryCode: cityData.countryCode,
        timezone: {
          name: cityData.timezone,
          offset: formatTimezoneOffset(timeInfo.utc_offset),
          displayName: cityData.timezone.replace('_', ' ')
        },
        imageUrl: getCityImageUrl(cityData.name)
      };
      
      handleAddCity(newCity);
      setSearchQuery('');
      setShowSearchResults(false);
    } catch (error) {
      console.error('Error adding city:', error);
      alert('Failed to add city. Please try again.');
    }
  };

  const handleRemoveCity = (cityId: string) => {
    setCities(prev => prev.filter(city => city.id !== cityId));
    setCityDisplayModes(prev => {
      const newModes = { ...prev };
      delete newModes[cityId];
      return newModes;
    });
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchResults = POPULAR_CITIES.filter(city => 
    (searchQuery.length === 0 || 
     city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     city.country.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !cities.some(existingCity => existingCity.timezone.name === city.timezone)
  );

  const emptySlots = Math.max(0, 9 - filteredCities.length);

  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          <div className="header">
            <h1 className="main-title">WORLD CLOCK</h1>
            
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => {
                  setTimeout(() => setShowSearchResults(false), 200);
                }}
                className="search-input"
              />
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.slice(0, 8).map(city => (
                    <div
                      key={`${city.name}-${city.countryCode}`}
                      className="search-result-item"
                      onClick={() => handleQuickAddCity(city)}
                    >
                      <div className="search-result-content">
                        <span className="search-result-name">{city.name}</span>
                        <span className="search-result-country">{city.country}</span>
                      </div>
                      <Plus className="search-result-add" size={16} />
                    </div>
                  ))}
                  {searchResults.length > 8 && (
                    <div className="search-result-more">
                      +{searchResults.length - 8} more cities...
                    </div>
                  )}
                </div>
              )}
              
              {showSearchResults && searchResults.length === 0 && (
                <div className="search-results">
                  <div className="search-no-results">
                    {searchQuery.length > 0 
                      ? "No cities found. Try the \"Add City\" button for custom options."
                      : "All popular cities have been added!"
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid-container">
            <div className="city-grid">
              {filteredCities.map(city => (
                <CityCard
                  key={city.id}
                  city={city}
                  displayMode={cityDisplayModes[city.id] || 'digital'}
                  onToggleMode={handleToggleMode}
                  onRemove={handleRemoveCity}
                />
              ))}
              
              {Array.from({ length: emptySlots }).map((_, index) => (
                <AddCityCard key={`add-${index}`} onClick={() => setIsModalOpen(true)} />
              ))}
            </div>
          </div>

          <AddCityModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddCity={handleAddCity}
          />
          
          <footer className="app-footer">
            <p className="footer-text">
              <span className="footer-highlight">Simon Bergstrand</span> FE24 TS-Project World Clock
            </p>
          </footer>
        </div>
      } />
      
      <Route path="/city/:cityId" element={
        <CityDetail cities={cities} />
      } />
    </Routes>
  );
};

// App component, Router wrapper
const App: React.FC = () => {
  return (
    <Router>
      <WorldClockApp />
    </Router>
  );
};

export default App;

