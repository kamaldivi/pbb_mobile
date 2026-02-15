# Orphan Cleanup Strategy - Implementation Details

## When Orphan Checks Run

### Check Triggers

#### 1. **Primary Trigger: Downloads Screen Visit** (Recommended)
- Check runs when user opens the Downloads screen
- Makes sense contextually - user is viewing their downloads
- Not intrusive - only runs when user is managing downloads
- Frequency: Once per app session per Downloads screen visit

**Why this is best:**
- User is already in "download management" mode
- Prompt is contextually relevant
- Doesn't slow down app startup
- Natural place for cleanup notifications

#### 2. **Secondary Trigger: Periodic Background Check**
- Check runs once every 7 days
- Only if user has downloaded books
- Shows subtle notification badge, not blocking alert
- User can dismiss or act on it

**Implementation:**
```typescript
// Last check stored in AsyncStorage
const ORPHAN_CHECK_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

async function shouldCheckForOrphans(): Promise<boolean> {
  const lastCheck = await AsyncStorage.getItem('lastOrphanCheck');
  if (!lastCheck) return true;

  const timeSinceCheck = Date.now() - parseInt(lastCheck);
  return timeSinceCheck > ORPHAN_CHECK_INTERVAL;
}
```

#### 3. **Never on App Startup** ❌
- **Don't** check on every app launch
- Slows down startup
- Annoying for users who just want to read
- Makes app feel sluggish

---

## Handling User Responses

### User Response Tracking

#### If User Clicks "Keep for Now"
Store the user's preference with a timestamp:

```typescript
interface OrphanDismissal {
  orphanBookIds: number[];
  dismissedAt: number;
  remindAfter: number; // milliseconds
}

// User clicks "Keep for Now"
await AsyncStorage.setItem('dismissedOrphans', JSON.stringify({
  orphanBookIds: [100, 101, 102],
  dismissedAt: Date.now(),
  remindAfter: 7 * 24 * 60 * 60 * 1000 // 7 days
}));
```

#### Reminder Strategy

**Option A: Gradual Reminder Increase (Recommended)**
```
First dismissal:  Ask again in 7 days
Second dismissal: Ask again in 14 days
Third dismissal:  Ask again in 30 days
Fourth+ dismissal: Only show badge, no popup
```

**Rationale:**
- Respects user's choice
- Gradually reduces reminder frequency
- Eventually just shows passive indicator
- User maintains control

**Option B: One-Time Dismissal**
```
User clicks "Keep for Now" → Never ask again for those specific books
```

**Rationale:**
- Maximum user control
- No repeated prompts
- User can manually clean up later
- Risk: User forgets, wastes storage

**Option C: Always Remind**
```
User clicks "Keep for Now" → Ask again in 7 days, always
```

**Rationale:**
- Keeps encouraging cleanup
- Helps users maintain storage
- Risk: Annoying for users who intentionally keep old versions

### Recommended Approach: **Option A (Gradual Reminder Increase)**

---

## Implementation Code

### 1. Orphan Dismissal Manager

```typescript
// src/services/offline/OrphanDismissalManager.ts
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
    if (dismissCount === 1) return 7 * 24 * 60 * 60 * 1000;
    if (dismissCount === 2) return 14 * 24 * 60 * 60 * 1000;
    return 30 * 24 * 60 * 60 * 1000;
  }

  /**
   * Check if we should show orphan alert
   */
  async shouldShowAlert(orphanIds: number[]): Promise<boolean> {
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

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
      orphanBookIds: orphanIds,
      dismissedAt: Date.now(),
      dismissCount,
    }));
  }

  /**
   * Clear dismissal record (after user removes orphans)
   */
  async clearDismissal(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
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
```

### 2. Updated OrphanDetector

```typescript
// src/services/offline/OrphanDetector.ts
import { offlineManager } from './OfflineManager';
import { booksApi } from '@/services/api/books';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const downloaded = await offlineManager.getDownloadedBooks();
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
}

export const orphanDetector = new OrphanDetector();
```

### 3. DownloadsScreen Implementation

```typescript
// src/screens/DownloadsScreen.tsx
import { orphanDetector } from '@/services/offline/OrphanDetector';
import { orphanDismissalManager } from '@/services/offline/OrphanDismissalManager';

const DownloadsScreen: React.FC<DownloadsScreenProps> = () => {
  const [isCheckingOrphans, setIsCheckingOrphans] = useState(false);

  useEffect(() => {
    const checkForOrphans = async () => {
      // Only check if user has downloaded books
      if (downloadedBooks.length === 0) return;

      // Prevent multiple simultaneous checks
      if (isCheckingOrphans) return;

      setIsCheckingOrphans(true);

      try {
        // Check if enough time has passed since last check
        const shouldCheck = await orphanDetector.shouldPerformCheck();
        if (!shouldCheck) return;

        // Find orphaned books
        const orphans = await orphanDetector.findOrphans();

        // Record that we performed a check
        await orphanDetector.recordCheck();

        if (orphans.length === 0) return;

        // Check if we should show alert (based on dismissal history)
        const shouldShow = await orphanDismissalManager.shouldShowAlert(orphans);
        if (!shouldShow) {
          // User dismissed recently, just show badge
          // Could add a subtle badge indicator here
          return;
        }

        // Show alert
        Alert.alert(
          'Downloaded Books Update',
          `${orphans.length} downloaded book${orphans.length > 1 ? 's have' : ' has'} been updated to newer versions on the server. The old version${orphans.length > 1 ? 's are' : ' is'} no longer available.\n\nWould you like to remove ${orphans.length > 1 ? 'them' : 'it'} to free up storage space?`,
          [
            {
              text: 'Keep for Now',
              style: 'cancel',
              onPress: async () => {
                // Record dismissal
                await orphanDismissalManager.recordDismissal(orphans);
              }
            },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: async () => {
                // Remove orphans
                await orphanDetector.cleanupOrphans(orphans);

                // Clear dismissal record
                await orphanDismissalManager.clearDismissal();

                // Refresh downloads list
                await loadDownloads();

                // Show success message
                Alert.alert(
                  'Cleanup Complete',
                  `${orphans.length} old book version${orphans.length > 1 ? 's' : ''} removed. You can download the latest version${orphans.length > 1 ? 's' : ''} from the Library.`
                );
              }
            }
          ]
        );
      } finally {
        setIsCheckingOrphans(false);
      }
    };

    // Run check when screen comes into focus
    checkForOrphans();
  }, [downloadedBooks.length]);

  // ... rest of component
};
```

---

## User Experience Flow

### Scenario 1: First Time Orphan Detected

```
User opens Downloads screen
  ↓
App detects 2 orphaned books
  ↓
Alert appears:
┌──────────────────────────────────────┐
│ Downloaded Books Update              │
├──────────────────────────────────────┤
│ 2 downloaded books have been         │
│ updated to newer versions on the     │
│ server. The old versions are no      │
│ longer available.                    │
│                                      │
│ Would you like to remove them to     │
│ free up storage space?               │
│                                      │
│ [Keep for Now]      [Remove]         │
└──────────────────────────────────────┘

User selects "Keep for Now"
  ↓
Dismissal recorded: "Remind in 7 days"
  ↓
User continues using Downloads screen normally
```

### Scenario 2: Second Dismissal (7+ days later)

```
User opens Downloads screen (8 days later)
  ↓
Same 2 orphaned books still present
  ↓
Alert appears again (same message)
  ↓
User selects "Keep for Now" again
  ↓
Dismissal recorded: "Remind in 14 days"
```

### Scenario 3: Third+ Dismissal (14+ days later)

```
User opens Downloads screen (15 days later)
  ↓
Same orphaned books still present
  ↓
Alert appears one more time
  ↓
User selects "Keep for Now" again
  ↓
Dismissal recorded: "Remind in 30 days"
  ↓
After 4th dismissal: No more popups, only subtle badge
```

### Scenario 4: User Removes Orphans

```
User sees alert
  ↓
User selects "Remove"
  ↓
Books deleted from local storage
  ↓
Dismissal record cleared
  ↓
Success message:
┌──────────────────────────────────────┐
│ Cleanup Complete                     │
├──────────────────────────────────────┤
│ 2 old book versions removed.         │
│ You can download the latest          │
│ versions from the Library.           │
│                                      │
│ [OK]                                 │
└──────────────────────────────────────┘
```

---

## Alternative: Manual Cleanup Option

For users who dismiss multiple times, add a manual cleanup button in Downloads screen:

```typescript
// Add to Downloads screen header
{orphanCount > 0 && (
  <TouchableOpacity
    style={styles.cleanupButton}
    onPress={handleManualCleanup}
  >
    <Ionicons name="trash-outline" size={20} color={colors.primary} />
    <Text style={styles.cleanupText}>
      Clean Up ({orphanCount})
    </Text>
  </TouchableOpacity>
)}
```

---

## Summary

### Check Timing
✅ **When Downloads screen is opened** (primary)
✅ **Once per 7 days** (background check)
❌ **Never on app startup** (too intrusive)

### User Response Handling
✅ **Gradual reminder increase** (7 days → 14 days → 30 days)
✅ **Eventually show passive indicator** (after 4th dismissal)
✅ **Clear dismissal after cleanup** (reset if user removes)

### Benefits
- Non-intrusive (only when user is managing downloads)
- Respects user choice (increasing intervals)
- Helps maintain storage (persistent reminders)
- Clear user control (manual option available)

---

## Required Dependencies

Add to package.json:
```bash
npm install @react-native-async-storage/async-storage
```

Or if using Expo:
```bash
expo install @react-native-async-storage/async-storage
```

---

## Testing Checklist

- [ ] Orphan detection works correctly (finds books deleted from server)
- [ ] First dismissal sets 7-day reminder
- [ ] Second dismissal sets 14-day reminder
- [ ] Third dismissal sets 30-day reminder
- [ ] Check only runs once per Downloads screen visit
- [ ] Dismissal persists across app restarts
- [ ] Cleanup removes books and clears dismissal
- [ ] No performance impact on Downloads screen load

---

## Last Updated
January 2026
