import { create } from 'zustand';
import { offlineManager } from '@/services/offline/OfflineManager';
import type { DownloadedBook, DownloadProgress } from '@/types/offline';

interface OfflineState {
  // Downloaded books
  downloadedBooks: DownloadedBook[];

  // Active downloads
  activeDownloads: Map<number, DownloadProgress>;

  // Network status
  isOnline: boolean;

  // Actions
  setOnlineStatus: (isOnline: boolean) => void;
  refreshDownloadedBooks: () => Promise<void>;
  startDownload: (bookId: number, onProgress?: (progress: DownloadProgress) => void) => void;
  updateDownloadProgress: (bookId: number, progress: DownloadProgress) => void;
  removeDownload: (bookId: number) => void;
  deleteBook: (bookId: number) => Promise<void>;
  isBookDownloaded: (bookId: number) => boolean;
  getDownloadedBook: (bookId: number) => DownloadedBook | undefined;
  updateLastRead: (bookId: number) => Promise<void>;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  downloadedBooks: [],
  activeDownloads: new Map(),
  isOnline: true,

  setOnlineStatus: (isOnline) => {
    set({ isOnline });
  },

  refreshDownloadedBooks: async () => {
    const books = await offlineManager.getAllDownloadedBooks();
    set({ downloadedBooks: books });
  },

  startDownload: (bookId, onProgress) => {
    const progress: DownloadProgress = {
      bookId,
      downloadedPages: 0,
      totalPages: 0,
      downloadedBytes: 0,
      totalBytes: 0,
      status: 'pending',
    };

    set((state) => {
      const newDownloads = new Map(state.activeDownloads);
      newDownloads.set(bookId, progress);
      return { activeDownloads: newDownloads };
    });

    if (onProgress) {
      get().updateDownloadProgress(bookId, progress);
    }
  },

  updateDownloadProgress: (bookId, progress) => {
    set((state) => {
      const newDownloads = new Map(state.activeDownloads);
      newDownloads.set(bookId, progress);
      return { activeDownloads: newDownloads };
    });

    // If download completed, refresh downloaded books
    if (progress.status === 'completed') {
      get().refreshDownloadedBooks();
      // Remove from active downloads after a delay
      setTimeout(() => {
        get().removeDownload(bookId);
      }, 2000);
    }
  },

  removeDownload: (bookId) => {
    set((state) => {
      const newDownloads = new Map(state.activeDownloads);
      newDownloads.delete(bookId);
      return { activeDownloads: newDownloads };
    });
  },

  deleteBook: async (bookId) => {
    await offlineManager.deleteBook(bookId);
    await get().refreshDownloadedBooks();
  },

  isBookDownloaded: (bookId) => {
    return get().downloadedBooks.some((book) => book.bookId === bookId);
  },

  getDownloadedBook: (bookId) => {
    return get().downloadedBooks.find((book) => book.bookId === bookId);
  },

  updateLastRead: async (bookId) => {
    await offlineManager.updateLastRead(bookId);
    await get().refreshDownloadedBooks();
  },
}));
