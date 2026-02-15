import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import type { Bookmark } from '@/types/models';

interface BookmarkState {
  bookmarks: Bookmark[];

  addBookmark: (data: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  isPageBookmarked: (bookId: number, page: number) => boolean;
  getBookmarksByBook: (bookId: number) => Bookmark[];
  getBookmarkForPage: (bookId: number, page: number) => Bookmark | undefined;
}

// Custom storage for SecureStore
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (data) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            {
              ...data,
              id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      updateBookmark: (id, updates) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          ),
        })),

      isPageBookmarked: (bookId, page) => {
        const bookmarks = get().bookmarks;
        return bookmarks.some(
          (b) => b.bookId === bookId && b.pageNumber === page
        );
      },

      getBookmarksByBook: (bookId) => {
        return get().bookmarks.filter((b) => b.bookId === bookId);
      },

      getBookmarkForPage: (bookId, page) => {
        return get().bookmarks.find(
          (b) => b.bookId === bookId && b.pageNumber === page
        );
      },
    }),
    {
      name: 'pbb-bookmarks',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
