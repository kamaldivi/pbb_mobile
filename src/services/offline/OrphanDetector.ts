import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineManager } from './OfflineManager';
import { booksApi } from '@/services/api/books';

const LAST_CHECK_KEY = 'lastOrphanCheck';
const CHECK_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

export class OrphanDetector {
  /**
   * Check if enough time has passed since last check
   */
  async shouldPerformCheck(): Promise<boolean> {
    const lastCheckStr = await AsyncStorage.getItem(LAST_CHECK_KEY);
    if (!lastCheckStr) return true;

    const lastCheck = parseInt(lastCheckStr);
    const timeSinceCheck = Date.now() - lastCheck;

    return timeSinceCheck > CHECK_INTERVAL;
  }

  /**
   * Record that a check was performed
   */
  async recordCheck(): Promise<void> {
    await AsyncStorage.setItem(LAST_CHECK_KEY, Date.now().toString());
  }

  /**
   * Find downloaded books that no longer exist on server
   */
  async findOrphans(): Promise<number[]> {
    const downloaded = await offlineManager.getAllDownloadedBooks();
    const orphans: number[] = [];

    for (const book of downloaded) {
      try {
        // Check if book still exists on server
        await booksApi.getById(book.bookId);
      } catch (error: any) {
        // If 404, book was deleted from server
        if (error.response?.status === 404) {
          orphans.push(book.bookId);
        }
        // Other errors (network, timeout) - ignore for now
      }
    }

    return orphans;
  }

  /**
   * Remove orphaned books from local storage
   */
  async cleanupOrphans(orphanIds: number[]): Promise<void> {
    for (const bookId of orphanIds) {
      await offlineManager.deleteBook(bookId);
    }
  }

  /**
   * Get details about orphaned books for display
   */
  async getOrphanDetails(orphanIds: number[]): Promise<Array<{ bookId: number; title: string }>> {
    const details = [];

    for (const bookId of orphanIds) {
      const book = await offlineManager.getDownloadedBook(bookId);
      if (book) {
        details.push({
          bookId,
          title: book.metadata.title || book.metadata.originalTitle || 'Unknown Book',
        });
      }
    }

    return details;
  }
}

export const orphanDetector = new OrphanDetector();
