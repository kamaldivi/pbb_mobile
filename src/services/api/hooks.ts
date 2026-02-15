import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { booksApi } from './books';
import type { Book } from '@/types/api';

// Fetch all books (with pagination handled internally)
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      // API has a max size limit of 100
      const PAGE_SIZE = 100;

      // Fetch first page to get total
      const firstPage = await booksApi.getAll(1, PAGE_SIZE);

      // If there are more books, fetch remaining pages
      if (firstPage.total > PAGE_SIZE) {
        const totalPages = Math.ceil(firstPage.total / PAGE_SIZE);
        const remainingPages = [];

        for (let page = 2; page <= totalPages; page++) {
          remainingPages.push(booksApi.getAll(page, PAGE_SIZE));
        }

        const results = await Promise.all(remainingPages);
        const allBooks = [
          ...firstPage.books,
          ...results.flatMap(r => r.books),
        ];

        return allBooks;
      }

      return firstPage.books;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - books don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Fetch single book by ID
export const useBook = (bookId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => booksApi.getById(bookId!),
    enabled: !!bookId && (options?.enabled ?? true),
    staleTime: 15 * 60 * 1000,
  });
};

// Fetch book TOC
export const useBookTOC = (bookId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['book', bookId, 'toc'],
    queryFn: () => booksApi.getTOC(bookId!),
    enabled: !!bookId && (options?.enabled ?? true),
    staleTime: 15 * 60 * 1000,
  });
};

// Fetch book pages
export const useBookPages = (bookId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['book', bookId, 'pages'],
    queryFn: () => booksApi.getPages(bookId!),
    enabled: !!bookId && (options?.enabled ?? true),
    staleTime: 15 * 60 * 1000,
  });
};

// Fetch core pages
export const useBookCorePages = (bookId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['book', bookId, 'core-pages'],
    queryFn: () => booksApi.getCorePages(bookId!),
    enabled: !!bookId && (options?.enabled ?? true),
    staleTime: 15 * 60 * 1000,
  });
};
