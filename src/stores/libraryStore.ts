import { create } from 'zustand';
import type { Book } from '@/types/api';
import type { BookCategory } from '@/types/models';

interface LibraryState {
  activeTab: BookCategory;
  searchTerm: string;
  selectedBook: Book | null;
  isDetailsModalOpen: boolean;

  setActiveTab: (tab: BookCategory) => void;
  setSearchTerm: (term: string) => void;
  openBookDetails: (book: Book) => void;
  closeBookDetails: () => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  activeTab: 'english',
  searchTerm: '',
  selectedBook: null,
  isDetailsModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab, searchTerm: '' }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  openBookDetails: (book) => set({ selectedBook: book, isDetailsModalOpen: true }),
  closeBookDetails: () => set({ selectedBook: null, isDetailsModalOpen: false }),
}));
