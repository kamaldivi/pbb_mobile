import apiClient from './client';
import type {
  Book,
  BookListResponse,
  TocResponse,
  FullPageMapResponse,
  CorePagesResponse,
} from '@/types/api';

export const booksApi = {
  async getAll(page = 1, size = 100): Promise<BookListResponse> {
    const response = await apiClient.get<BookListResponse>('/api/v1/books', {
      params: { page, size },
    });
    return response.data;
  },

  async getById(bookId: number): Promise<Book> {
    const response = await apiClient.get<Book>(`/api/v1/books/${bookId}`);
    return response.data;
  },

  async getTOC(bookId: number): Promise<TocResponse> {
    const response = await apiClient.get<TocResponse>(`/api/v1/books/${bookId}/toc`);
    return response.data;
  },

  async getPages(bookId: number): Promise<FullPageMapResponse> {
    const response = await apiClient.get<FullPageMapResponse>(`/api/v1/books/${bookId}/pages`);
    return response.data;
  },

  async getCorePages(bookId: number): Promise<CorePagesResponse> {
    const response = await apiClient.get<CorePagesResponse>(`/api/v1/books/${bookId}/pages/core`);
    return response.data;
  },
};
