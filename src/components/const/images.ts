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
  'delhi': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&auto=format',
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

export const getCityImageUrl = (cityName: string): string => {
  const key = cityName.toLowerCase();
  return CITY_IMAGES[key] || CITY_IMAGES['default'];
};

export const CITY_IMAGES_EXPORT = CITY_IMAGES;
