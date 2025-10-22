type ClockDisplayMode = 'digital' | 'analog';

interface TimeZone {
  name: string;
  offset: string;
  displayName: string;
}

interface TimeZoneInfo {
  timezone: string;
  utc_offset: string;
  datetime: string;
  day_of_year: number;
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

export type { City, ClockSettings, ClockDisplayMode, TimeZone, TimeZoneInfo, CityData };
