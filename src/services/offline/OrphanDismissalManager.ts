import AsyncStorage from '@react-native-async-storage/async-storage';

interface OrphanDismissal {
  orphanBookIds: number[];
  dismissedAt: number;
  dismissCount: number;
}

const STORAGE_KEY = 'dismissedOrphans';

export class OrphanDismissalManager {
  /**
   * Get reminder interval based on dismiss count
   * 1st: 7 days, 2nd: 14 days, 3rd+: 30 days
   */
  private getReminderInterval(dismissCount: number): number {
    if (dismissCount === 1) return 7 * 24 * 60 * 60 * 1000; // 7 days
    if (dismissCount === 2) return 14 * 24 * 60 * 60 * 1000; // 14 days
    return 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  /**
   * Check if we should show orphan alert
   */
  async shouldShowAlert(orphanIds: number[]): Promise<boolean> {
    if (orphanIds.length === 0) return false;

    const dismissedStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (!dismissedStr) return true;

    const dismissed: OrphanDismissal = JSON.parse(dismissedStr);

    // Check if these are the same orphans
    const sameOrphans =
      orphanIds.length === dismissed.orphanBookIds.length &&
      orphanIds.every(id => dismissed.orphanBookIds.includes(id));

    if (!sameOrphans) {
      // Different orphans detected, show alert
      return true;
    }

    // After 3 dismissals, don't show popup anymore
    if (dismissed.dismissCount >= 3) {
      return false;
    }

    // Same orphans - check if reminder interval has passed
    const interval = this.getReminderInterval(dismissed.dismissCount);
    const timeSinceDismissal = Date.now() - dismissed.dismissedAt;

    return timeSinceDismissal > interval;
  }

  /**
   * Record that user dismissed the alert
   */
  async recordDismissal(orphanIds: number[]): Promise<void> {
    const dismissedStr = await AsyncStorage.getItem(STORAGE_KEY);
    let dismissCount = 1;

    if (dismissedStr) {
      const dismissed: OrphanDismissal = JSON.parse(dismissedStr);
      // Check if same orphans
      const sameOrphans =
        orphanIds.length === dismissed.orphanBookIds.length &&
        orphanIds.every(id => dismissed.orphanBookIds.includes(id));

      if (sameOrphans) {
        dismissCount = dismissed.dismissCount + 1;
      }
    }

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        orphanBookIds: orphanIds,
        dismissedAt: Date.now(),
        dismissCount,
      })
    );
  }

  /**
   * Clear dismissal record (after user removes orphans)
   */
  async clearDismissal(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get number of times user has dismissed
   */
  async getDismissCount(): Promise<number> {
    const dismissedStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (!dismissedStr) return 0;

    const dismissed: OrphanDismissal = JSON.parse(dismissedStr);
    return dismissed.dismissCount;
  }

  /**
   * Get next reminder time for UI display
   */
  async getNextReminderTime(): Promise<Date | null> {
    const dismissedStr = await AsyncStorage.getItem(STORAGE_KEY);
    if (!dismissedStr) return null;

    const dismissed: OrphanDismissal = JSON.parse(dismissedStr);
    const interval = this.getReminderInterval(dismissed.dismissCount);

    return new Date(dismissed.dismissedAt + interval);
  }
}

export const orphanDismissalManager = new OrphanDismissalManager();
