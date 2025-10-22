import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { City, ClockDisplayMode } from './const/types';
import { useCurrentTime } from './hooks/useCurrentTime';
import { AnalogClock } from './AnalogClock';

interface CityCardProps {
  city: City;
  displayMode: ClockDisplayMode;
  onToggleMode: (cityId: string, mode: ClockDisplayMode) => void;
  onRemove: (cityId: string) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, displayMode, onToggleMode, onRemove }) => {
  const navigate = useNavigate();
  const currentTime = useCurrentTime();
  
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