import type { Book, TableOfContents, CorePageInfo } from './api';

export interface DownloadedBook {
  bookId: number;
  metadata: {
    title: string;
    originalTitle: string;
    author: string;
    totalPages: number;
    downloadedAt: string;
    lastReadAt?: string;
    size: number; // in bytes
  };
  toc: TableOfContents[];
  corePages: CorePageInfo[];
  downloadStatus: DownloadStatus;
}

export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';

export interface DownloadProgress {
  bookId: number;
  downloadedPages: number;
  totalPages: number;
  downloadedBytes: number;
  totalBytes: number;
  status: DownloadStatus;
  error?: string;
}

export interface StorageInfo {
  totalDownloaded: number; // number of books
  totalSize: number; // in bytes
  availableSpace: number; // in bytes
  downloads: DownloadedBook[];
}

export interface DownloadQueueItem {
  bookId: number;
  book: Book;
  priority: number;
}
