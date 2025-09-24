import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin } from 'lucide-react';
import './CityDetail.css';

// Import types from App
import type { City, TimeZone } from './App';

interface CityDetailProps {
  cities: City[];
}

const CityDetail: React.FC<CityDetailProps> = ({ cities }) => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Find the city by ID
  const city = cities.find(c => c.id === cityId);
  
  useEffect(() => {
    if (!city) return;
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [city]);
  
  // Calculate local time for the city
  const getLocalTime = (date: Date, timezone: string): Date => {
    if (timezone.startsWith('UTC')) {
      const offset = timezone.replace('UTC', '');
      const offsetHours = parseFloat(offset) || 0;
      const offsetMinutes = (Math.abs(offsetHours) % 1) * 60;
      const totalOffsetMinutes = Math.floor(offsetHours) * 60 + (offsetHours >= 0 ? offsetMinutes : -offsetMinutes);
      
      const utcTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      return new Date(utcTime.getTime() + totalOffsetMinutes * 60000);
    } else {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
        const values = parts.reduce((acc, part) => {
          acc[part.type] = part.value;
          return acc;
        }, {} as any);
        
        return new Date(
          parseInt(values.year),
          parseInt(values.month) - 1,
          parseInt(values.day),
          parseInt(values.hour),
          parseInt(values.minute),
          parseInt(values.second)
        );
      } catch (error) {
        return date;
      }
    }
  };
  
  if (!city) {
    return (
      <div className="city-detail-error">
        <h2>City not found</h2>
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Back to World Clock
        </Link>
      </div>
    );
  }
  
  const localTime = getLocalTime(currentTime, city.timezone.name);
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };
  
  // Calculate time difference from user's local time
  const userOffset = new Date().getTimezoneOffset() / -60;
  const cityOffset = parseFloat(city.timezone.offset.replace('+', '')) || 0;
  const timeDifference = cityOffset - userOffset;
  const timeDiffText = timeDifference === 0 
    ? 'Same as your time'
    : `${Math.abs(timeDifference)} hours ${timeDifference > 0 ? 'ahead' : 'behind'}`;
  
  return (
    <div className="city-detail-container">
      <div 
        className="city-detail-hero"
        style={{ backgroundImage: `url(${city.imageUrl})` }}
      >
        <div className="hero-overlay">
          <Link to="/" className="back-button">
            <ArrowLeft size={20} />
            Back
          </Link>
          
          <div className="hero-content">
            <h1 className="city-title">{city.name}</h1>
            <p className="city-subtitle">{city.country}</p>
          </div>
        </div>
      </div>
      
      <div className="detail-content">
        <div className="time-section">
          <div className="current-time-display">
            <div className="time-main">
              <Clock size={24} />
              <span className="time-value">{formatTime(localTime)}</span>
            </div>
            <div className="time-date">
              <Calendar size={16} />
              <span>{formatDate(localTime)}</span>
            </div>
          </div>
          
          <div className="time-info-grid">
            <div className="info-card">
              <MapPin size={20} />
              <div>
                <span className="info-label">Timezone</span>
                <span className="info-value">{city.timezone.displayName}</span>
              </div>
            </div>
            
            <div className="info-card">
              <Clock size={20} />
              <div>
                <span className="info-label">UTC Offset</span>
                <span className="info-value">GMT {city.timezone.offset}</span>
              </div>
            </div>
            
            <div className="info-card">
              <Clock size={20} />
              <div>
                <span className="info-label">Relative to you</span>
                <span className="info-value">{timeDiffText}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="analog-clock-section">
          <h2>Analog Clock</h2>
          <AnalogClockLarge time={localTime} />
        </div>
      </div>
    </div>
  );
};

// Large analog clock for detail view
const AnalogClockLarge: React.FC<{ time: Date }> = ({ time }) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5) - 90;
  const minuteAngle = (minutes * 6) + (seconds * 0.1) - 90;
  const secondAngle = (seconds * 6) - 90;
  
  const size = 200;
  const center = size / 2;
  
  return (
    <svg width={size} height={size} className="analog-clock-large">
      <circle
        cx={center}
        cy={center}
        r={center - 4}
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) - 90;
        const isMainHour = i % 3 === 0;
        const markerLength = isMainHour ? 10 : 5;
        const x1 = center + (center - 15) * Math.cos(angle * Math.PI / 180);
        const y1 = center + (center - 15) * Math.sin(angle * Math.PI / 180);
        const x2 = center + (center - 15 - markerLength) * Math.cos(angle * Math.PI / 180);
        const y2 = center + (center - 15 - markerLength) * Math.sin(angle * Math.PI / 180);
        
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth={isMainHour ? 2 : 1}
          />
        );
      })}
      
      {/* Hour hand */}
      <line
        x1={center}
        y1={center}
        x2={center + (size * 0.25) * Math.cos(hourAngle * Math.PI / 180)}
        y2={center + (size * 0.25) * Math.sin(hourAngle * Math.PI / 180)}
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Minute hand */}
      <line
        x1={center}
        y1={center}
        x2={center + (size * 0.35) * Math.cos(minuteAngle * Math.PI / 180)}
        y2={center + (size * 0.35) * Math.sin(minuteAngle * Math.PI / 180)}
        stroke="black"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Second hand */}
      <line
        x1={center}
        y1={center}
        x2={center + (size * 0.38) * Math.cos(secondAngle * Math.PI / 180)}
        y2={center + (size * 0.38) * Math.sin(secondAngle * Math.PI / 180)}
        stroke="red"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Center dot */}
      <circle cx={center} cy={center} r="4" fill="black" />
    </svg>
  );
};

export default CityDetail;