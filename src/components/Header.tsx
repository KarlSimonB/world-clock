import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { CityData } from './const/types';
import { POPULAR_CITIES } from './const/cities';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCityAdd: (city: CityData) => void;
  existingCities: string[]; // timezone names of existing cities
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCityAdd,
  existingCities
}) => {
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchResults = POPULAR_CITIES.filter(city => 
    (searchQuery.length === 0 || 
     city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     city.country.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !existingCities.includes(city.timezone)
  );

  const handleCityClick = (city: CityData) => {
    onCityAdd(city);
    onSearchChange('');
    setShowSearchResults(false);
  };

  return (
    <div className="header">
      <h1 className="main-title">WORLD CLOCK</h1>
      
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowSearchResults(true)}
          onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
          className="search-input"
        />
        
        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.slice(0, 8).map(city => (
              <div
                key={`${city.name}-${city.countryCode}`}
                className="search-result-item"
                onClick={() => handleCityClick(city)}
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
  );
};