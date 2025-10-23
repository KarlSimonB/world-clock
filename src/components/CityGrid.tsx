import React from 'react';
import { CityCard } from './CityCard';
import { AddCityCard } from './AddCityCard';
import { City, ClockDisplayMode } from './const/types';

interface CityGridProps {
  cities: City[];
  cityDisplayModes: Record<string, ClockDisplayMode>;
  onToggleMode: (cityId: string, mode: ClockDisplayMode) => void;
  onRemoveCity: (cityId: string) => void;
  onAddClick: () => void;
}

export const CityGrid: React.FC<CityGridProps> = ({
  cities,
  cityDisplayModes,
  onToggleMode,
  onRemoveCity,
  onAddClick
}) => {
  const emptySlots = Math.max(0, 9 - cities.length);

  return (
    <div className="grid-container">
      <div className="city-grid">
        {cities.map(city => (
          <CityCard
            key={city.id}
            city={city}
            displayMode={cityDisplayModes[city.id] || 'digital'}
            onToggleMode={onToggleMode}
            onRemove={onRemoveCity}
          />
        ))}
        
        {Array.from({ length: emptySlots }).map((_, index) => (
          <AddCityCard key={`add-${index}`} onClick={onAddClick} />
        ))}
      </div>
    </div>
  );
};