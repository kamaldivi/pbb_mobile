// Bookmark Types
export interface Bookmark {
  id: string;
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  pageLabel?: string;
  customName?: string;
  createdAt: string;
  updatedAt: string;
}

// Reading Progress Types
export interface ReadingProgress {
  [bookId: number]: {
    page: number;
    timestamp: string;
  };
}

// Book Category Types
export type BookCategory = 'english' | 'tamil' | 'rays';

export interface BooksByCategory {
  english: number[];
  tamil: number[];
  rays: number[];
}
