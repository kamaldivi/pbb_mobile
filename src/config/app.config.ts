export const APP_CONFIG = {
  // Image preloading
  preload: {
    count: 2, // Number of pages to preload ahead
    onlyOnWifi: true, // Only preload on WiFi
  },

  // Cache settings
  cache: {
    maxCachedPages: 5, // Maximum pages kept in cache
    maxBooksCached: 10, // Maximum books metadata cached
  },

  // Performance
  performance: {
    enableNativeDriver: true,
    maxConcurrentImageLoads: 5,
  },

  // Features
  features: {
    enableBookmarks: true,
    enableShare: true,
    enableOfflineMode: true,
  },
};
