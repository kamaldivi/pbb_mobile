import apiClient from './client';
import type { TocResponse } from '@/types/api';

class TocAPI {
  async getTableOfContents(bookId: number): Promise<TocResponse> {
    const response = await apiClient.get<TocResponse>(`/api/v1/books/${bookId}/toc`);
    return response.data;
  }
}

export const tocApi = new TocAPI();
