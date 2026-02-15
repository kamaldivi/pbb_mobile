import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import { booksApi } from '../api/books';
import { IMAGE_CONFIG } from '@/config/api.config';
import type { Book } from '@/types/api';
import type { DownloadedBook, DownloadProgress } from '@/types/offline';

const BOOKS_DIR = `${FileSystem.documentDirectory}books/`;

export class OfflineManager {
  private downloadProgress: Map<number, DownloadProgress> = new Map();
  private downloadCallbacks: Map<number, (progress: DownloadProgress) => void> = new Map();

  /**
   * Initialize offline storage directory
   */
  async initialize(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(BOOKS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(BOOKS_DIR, { intermediates: true });
    }
  }

  /**
   * Get book directory path
   */
  private getBookDir(bookId: number): string {
    return `${BOOKS_DIR}${bookId}/`;
  }

  /**
   * Get pages directory path
   */
  private getPagesDir(bookId: number): string {
    return `${this.getBookDir(bookId)}pages/`;
  }

  /**
   * Check if book is downloaded
   */
  async isBookDownloaded(bookId: number): Promise<boolean> {
    const metadataPath = `${this.getBookDir(bookId)}metadata.json`;
    const fileInfo = await FileSystem.getInfoAsync(metadataPath);
    return fileInfo.exists;
  }

  /**
   * Get downloaded book metadata
   */
  async getDownloadedBook(bookId: number): Promise<DownloadedBook | null> {
    try {
      const metadataPath = `${this.getBookDir(bookId)}metadata.json`;
      const fileInfo = await FileSystem.getInfoAsync(metadataPath);

      if (!fileInfo.exists) {
        return null;
      }

      const content = await FileSystem.readAsStringAsync(metadataPath);
      return JSON.parse(content) as DownloadedBook;
    } catch (error) {
      console.error(`Error reading book ${bookId}:`, error);
      return null;
    }
  }

  /**
   * Calculate book download size (estimate)
   */
  async estimateBookSize(book: Book): Promise<number> {
    // Estimate: ~300KB per page on average for WebP images
    const BYTES_PER_PAGE = 300 * 1024;
    return book.number_of_pages * BYTES_PER_PAGE;
  }

  /**
   * Get available storage space
   */
  async getAvailableSpace(): Promise<number> {
    const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
    return freeDiskStorage;
  }

  /**
   * Get total size of downloaded books
   */
  async getTotalDownloadedSize(): Promise<number> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(BOOKS_DIR);
      if (!dirInfo.exists) {
        return 0;
      }

      const books = await FileSystem.readDirectoryAsync(BOOKS_DIR);
      let totalSize = 0;

      for (const bookDir of books) {
        const metadataPath = `${BOOKS_DIR}${bookDir}/metadata.json`;
        const fileInfo = await FileSystem.getInfoAsync(metadataPath);

        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(metadataPath);
          const metadata = JSON.parse(content) as DownloadedBook;
          totalSize += metadata.metadata.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating total size:', error);
      return 0;
    }
  }

  /**
   * Download a book for offline use
   */
  async downloadBook(
    book: Book,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const bookId = book.book_id;

    // Check if already downloaded
    if (await this.isBookDownloaded(bookId)) {
      throw new Error('Book already downloaded');
    }

    // Check available space
    const estimatedSize = await this.estimateBookSize(book);
    const availableSpace = await this.getAvailableSpace();

    if (estimatedSize > availableSpace) {
      throw new Error('Insufficient storage space');
    }

    // Initialize progress
    const progress: DownloadProgress = {
      bookId,
      downloadedPages: 0,
      totalPages: book.number_of_pages,
      downloadedBytes: 0,
      totalBytes: estimatedSize,
      status: 'downloading',
    };

    this.downloadProgress.set(bookId, progress);
    if (onProgress) {
      this.downloadCallbacks.set(bookId, onProgress);
    }

    try {
      // Create book directory
      const bookDir = this.getBookDir(bookId);
      const pagesDir = this.getPagesDir(bookId);
      await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
      await FileSystem.makeDirectoryAsync(pagesDir, { intermediates: true });

      // Fetch book metadata
      const [bookData, tocData, corePagesData] = await Promise.all([
        booksApi.getById(bookId),
        booksApi.getTOC(bookId),
        booksApi.getCorePages(bookId),
      ]);

      // Download all pages
      let downloadedSize = 0;
      for (let pageNum = 1; pageNum <= book.number_of_pages; pageNum++) {
        const imageUrl = IMAGE_CONFIG.getBookPage(bookId, pageNum);
        const localPath = `${pagesDir}${pageNum}.webp`;

        // Download page image
        const downloadResult = await FileSystem.downloadAsync(imageUrl, localPath);

        if (downloadResult.status !== 200) {
          throw new Error(`Failed to download page ${pageNum}`);
        }

        // Update progress
        const fileInfo = await FileSystem.getInfoAsync(localPath);
        if (fileInfo.exists && fileInfo.size) {
          downloadedSize += fileInfo.size;
        }

        progress.downloadedPages = pageNum;
        progress.downloadedBytes = downloadedSize;
        this.updateProgress(bookId, progress);
      }

      // Save metadata
      const downloadedBook: DownloadedBook = {
        bookId,
        metadata: {
          title: bookData.english_book_title || bookData.original_book_title || 'Unknown',
          originalTitle: bookData.original_book_title || '',
          author: bookData.original_author || 'Unknown',
          totalPages: book.number_of_pages,
          downloadedAt: new Date().toISOString(),
          size: downloadedSize,
        },
        toc: tocData.table_of_contents || [],
        corePages: corePagesData.pages || [],
        downloadStatus: 'completed',
      };

      // Save metadata to file
      await FileSystem.writeAsStringAsync(
        `${bookDir}metadata.json`,
        JSON.stringify(downloadedBook, null, 2)
      );

      // Update progress to completed
      progress.status = 'completed';
      progress.downloadedBytes = downloadedSize;
      progress.totalBytes = downloadedSize;
      this.updateProgress(bookId, progress);

    } catch (error) {
      // Update progress to failed
      progress.status = 'failed';
      progress.error = error instanceof Error ? error.message : 'Download failed';
      this.updateProgress(bookId, progress);

      // Clean up partial download
      await this.deleteBook(bookId);

      throw error;
    } finally {
      this.downloadProgress.delete(bookId);
      this.downloadCallbacks.delete(bookId);
    }
  }

  /**
   * Update download progress
   */
  private updateProgress(bookId: number, progress: DownloadProgress): void {
    const callback = this.downloadCallbacks.get(bookId);
    if (callback) {
      callback(progress);
    }
  }

  /**
   * Delete downloaded book
   */
  async deleteBook(bookId: number): Promise<void> {
    const bookDir = this.getBookDir(bookId);
    const dirInfo = await FileSystem.getInfoAsync(bookDir);

    if (dirInfo.exists) {
      await FileSystem.deleteAsync(bookDir, { idempotent: true });
    }
  }

  /**
   * Get local page path
   */
  getLocalPagePath(bookId: number, pageNumber: number): string {
    return `${this.getPagesDir(bookId)}${pageNumber}.webp`;
  }

  /**
   * Get all downloaded books
   */
  async getAllDownloadedBooks(): Promise<DownloadedBook[]> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(BOOKS_DIR);
      if (!dirInfo.exists) {
        return [];
      }

      const bookDirs = await FileSystem.readDirectoryAsync(BOOKS_DIR);
      const books: DownloadedBook[] = [];

      for (const bookDir of bookDirs) {
        const bookId = parseInt(bookDir, 10);
        if (isNaN(bookId)) continue;

        const book = await this.getDownloadedBook(bookId);
        if (book) {
          books.push(book);
        }
      }

      return books;
    } catch (error) {
      console.error('Error getting downloaded books:', error);
      return [];
    }
  }

  /**
   * Update last read timestamp
   */
  async updateLastRead(bookId: number): Promise<void> {
    const book = await this.getDownloadedBook(bookId);
    if (!book) return;

    book.metadata.lastReadAt = new Date().toISOString();

    await FileSystem.writeAsStringAsync(
      `${this.getBookDir(bookId)}metadata.json`,
      JSON.stringify(book, null, 2)
    );
  }
}

// Singleton instance
export const offlineManager = new OfflineManager();
