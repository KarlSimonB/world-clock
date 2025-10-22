import React from 'react';

// Analog Clock Component
export const AnalogClock: React.FC<{ 
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