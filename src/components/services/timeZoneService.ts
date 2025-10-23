import { TimeZoneInfo } from '../const/types';

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
      'Asia/Kolkata': '+05:30',
      'Asia/Shanghai': '+08:00',
      'America/Chicago': '-06:00',
      'Europe/Berlin': '+01:00',
      'America/Toronto': '-05:00',
      'Europe/Rome': '+01:00',
      'Asia/Bangkok': '+07:00',
      'America/Mexico_City': '-06:00',
      'Pacific/Auckland': '+13:00'
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

export { timeZoneService };