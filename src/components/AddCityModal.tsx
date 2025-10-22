import React, { useState } from 'react';
import { X } from 'lucide-react';
import { City, CityData, } from './const/types';
import { POPULAR_CITIES } from './const/cities';
import { UTC_OFFSETS } from './const/utcOffsets';
import { getCityImageUrl } from './const/images';
import { timeZoneService } from './services/timeZoneService';
import { formatTimezoneOffset } from '../utils/formatTimezoneOffset';

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (city: City) => void;
}

export const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose, onAddCity }) => {
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
            displayName: selectedCity.timezone.replace(/_/g, ' ')
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

export default AddCityModal;