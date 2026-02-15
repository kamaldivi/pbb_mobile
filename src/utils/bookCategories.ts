import type { Book } from '@/types/api';
import type { BookCategory } from '@/types/models';

export interface CategorizedBooks {
  english: Book[];
  tamil: Book[];
  rays: Book[];
}

export interface SubgroupedBooks {
  gurudev: Book[];
  gokulBhajan: Book[];
}

// Helper to determine if a book is a Gokul Bhajan book
const isGokulBhajanBook = (book: Book): boolean => {
  const bookType = book.book_type?.toLowerCase() || '';
  return bookType.includes('gokul') || bookType.includes('bhajan');
};

// Map book_type from API to our categories
export const categorizeBooks = (books: Book[]): CategorizedBooks => {
  const categorized = {
    english: [] as Book[],
    tamil: [] as Book[],
    rays: [] as Book[],
  };

  books.forEach((book) => {
    const bookType = book.book_type?.toLowerCase();

    if (bookType?.includes('rays')) {
      categorized.rays.push(book);
    } else if (bookType?.includes('tamil')) {
      categorized.tamil.push(book);
    } else if (bookType?.includes('english')) {
      categorized.english.push(book);
    } else {
      // Default to english if no type specified
      categorized.english.push(book);
    }
  });

  // Sort each category alphabetically by title
  Object.keys(categorized).forEach((category) => {
    categorized[category as BookCategory].sort((a, b) =>
      (a.original_book_title || '').localeCompare(b.original_book_title || '')
    );
  });

  return categorized;
};

// Subgroup books into Gurudev and Gokul Bhajan
export const subgroupBooks = (books: Book[]): SubgroupedBooks => {
  const gurudev: Book[] = [];
  const gokulBhajan: Book[] = [];

  books.forEach((book) => {
    if (isGokulBhajanBook(book)) {
      gokulBhajan.push(book);
    } else {
      gurudev.push(book);
    }
  });

  // Sort alphabetically by title
  gurudev.sort((a, b) =>
    (a.original_book_title || '').localeCompare(b.original_book_title || '')
  );
  gokulBhajan.sort((a, b) =>
    (a.original_book_title || '').localeCompare(b.original_book_title || '')
  );

  return { gurudev, gokulBhajan };
};

export const getCategoryLabel = (category: BookCategory): string => {
  const labels = {
    english: 'English',
    tamil: 'Tamil',
    rays: 'Rays of The Harmonist',
  };
  return labels[category];
};
