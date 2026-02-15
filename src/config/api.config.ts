import Constants from 'expo-constants';

export const API_CONFIG = {
  baseURL: Constants.expoConfig?.extra?.apiBaseUrl || 'https://purebhaktibase.com:8443',
  timeout: 15000,
};

export const IMAGE_CONFIG = {
  baseURL: Constants.expoConfig?.extra?.imageBaseUrl || 'https://purebhaktibase.com',

  getBookThumbnail: (bookId: number): string =>
    `${IMAGE_CONFIG.baseURL}/pbb_book_thumbnails/${bookId}.jpg`,

  getBookPage: (bookId: number, pageNumber: number): string =>
    `${IMAGE_CONFIG.baseURL}/pbb_book_pages/${bookId}/${pageNumber}.webp`,

  cache: {
    maxSize: 100 * 1024 * 1024, // 100 MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};
