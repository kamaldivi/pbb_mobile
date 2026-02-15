import { create } from 'zustand';

interface ReaderState {
  currentBookId: number | null;
  currentPage: number;
  isTOCOpen: boolean;
  isFullscreen: boolean;
  isGoToPageOpen: boolean;
  zoomLevel: number;

  setCurrentBook: (bookId: number, page?: number) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  toggleTOC: () => void;
  toggleFullscreen: () => void;
  openGoToPage: () => void;
  closeGoToPage: () => void;
  setZoomLevel: (level: number) => void;
  reset: () => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  currentBookId: null,
  currentPage: 1,
  isTOCOpen: false,
  isFullscreen: false,
  isGoToPageOpen: false,
  zoomLevel: 1,

  setCurrentBook: (bookId, page = 1) =>
    set({ currentBookId: bookId, currentPage: page }),

  setCurrentPage: (page) => set({ currentPage: page }),

  nextPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),

  prevPage: () =>
    set((state) => ({
      currentPage: Math.max(1, state.currentPage - 1),
    })),

  toggleTOC: () => set((state) => ({ isTOCOpen: !state.isTOCOpen })),

  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  openGoToPage: () => set({ isGoToPageOpen: true }),

  closeGoToPage: () => set({ isGoToPageOpen: false }),

  setZoomLevel: (level) => set({ zoomLevel: level }),

  reset: () =>
    set({
      currentBookId: null,
      currentPage: 1,
      isTOCOpen: false,
      isFullscreen: false,
      isGoToPageOpen: false,
      zoomLevel: 1,
    }),
}));
