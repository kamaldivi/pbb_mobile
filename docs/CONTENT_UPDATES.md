# Content Updates & Book Versioning Strategy

## Overview
This document outlines how the Pure Bhakti Base mobile app handles new books, book version updates, and content synchronization.

## Current Behavior

### New Books
**✅ Automatic Discovery**
- New books added to the backend API will **automatically appear** in the mobile app
- No app update required
- How it works:
  - App fetches book list from API on each launch: `GET /books`
  - Books are cached for 10 minutes (configurable in `src/services/api/hooks.ts`)
  - Pull-to-refresh can force immediate update
  - Switching tabs refreshes the book list

**User Experience:**
1. User opens app
2. App fetches latest book list from server
3. New books appear in appropriate category (English/Tamil/Rays)
4. User can immediately browse and read new books

### Book Version Updates - Current Implementation

**⚠️ Issue: Orphaned Downloads**

When a book version is updated on the server (new book_id assigned):

**What happens on server:**
- Old book: `book_id: 123` → Deleted from server
- New version: `book_id: 456` → Added to server

**What happens in mobile app:**
1. **Online mode**: Works fine
   - User sees new book (456) in library
   - Old book (123) no longer appears
   - Reading new version works normally

2. **Offline mode**: Problems occur
   - User still has book 123 downloaded locally
   - Book 123 no longer exists on server
   - Downloaded book appears in "Downloads" screen
   - But book 123 is missing from main Library
   - User may be confused why downloaded book isn't visible

**Example Scenario:**
```
Day 1: User downloads "Bhagavad-gita" (book_id: 100)
Day 30: Publisher releases new edition with corrections
        - Server deletes book 100
        - Server adds book 101 (new version)
Day 31: User opens app
        - Book 100 still in "Downloads" screen
        - Book 100 NOT in "Library" screen
        - Book 101 appears in "Library" (not downloaded)
        - User confused: "I already downloaded this book!"
```

## Recommended Solutions

### Option 1: Version Detection & Migration (Recommended)

**Concept**: Detect when downloaded books have newer versions and offer migration.

**Implementation Steps:**

1. **Add version tracking to API** (Backend change):
```typescript
interface Book {
  book_id: number;
  version: string;  // e.g., "1.0", "1.1", "2.0"
  previous_version_id?: number;  // Link to old book_id
  // ... existing fields
}
```

2. **Add version check service** (Mobile app):
```typescript
// src/services/offline/VersionManager.ts
class VersionManager {
  async checkForUpdates(): Promise<BookUpdate[]> {
    const downloadedBooks = await offlineManager.getDownloadedBooks();
    const updates = [];

    for (const downloaded of downloadedBooks) {
      // Check if book still exists on server
      const serverBook = await booksApi.getById(downloaded.bookId);

      if (!serverBook) {
        // Book no longer exists - check for newer version
        const newerVersion = await booksApi.findNewerVersion(downloaded.bookId);
        if (newerVersion) {
          updates.push({
            oldBookId: downloaded.bookId,
            newBookId: newerVersion.book_id,
            oldVersion: downloaded.metadata.version,
            newVersion: newerVersion.version,
          });
        }
      }
    }

    return updates;
  }
}
```

3. **Show update notification**:
```
┌─────────────────────────────────────┐
│  Updates Available                  │
├─────────────────────────────────────┤
│  • Bhagavad-gita (v1.0 → v1.1)     │
│    New edition with corrections     │
│                                     │
│  [Update All]  [View Details]      │
└─────────────────────────────────────┘
```

4. **Migration process**:
   - Delete old version (book_id: 100)
   - Download new version (book_id: 101)
   - Preserve user's reading position if possible

**Pros:**
- Clean user experience
- No confusion about missing books
- Users get latest content automatically
- Can preserve reading position

**Cons:**
- Requires backend API changes
- More complex implementation
- Requires re-downloading content

---

### Option 2: Orphan Cleanup (Simpler, No Backend Changes)

**Concept**: Detect and clean up orphaned downloads automatically.

**Implementation:**

1. **Check if downloaded book still exists** (Mobile app only):
```typescript
// src/services/offline/OrphanDetector.ts
class OrphanDetector {
  async findOrphans(): Promise<number[]> {
    const downloaded = await offlineManager.getDownloadedBooks();
    const orphans = [];

    for (const book of downloaded) {
      try {
        // Try to fetch book from server
        await booksApi.getById(book.bookId);
      } catch (error) {
        if (error.response?.status === 404) {
          // Book no longer exists on server
          orphans.push(book.bookId);
        }
      }
    }

    return orphans;
  }

  async cleanupOrphans(orphanIds: number[]): Promise<void> {
    for (const bookId of orphanIds) {
      await offlineManager.deleteBook(bookId);
    }
  }
}
```

2. **Run cleanup on app launch**:
```typescript
// In LibraryScreen or App.tsx
useEffect(() => {
  const checkOrphans = async () => {
    const orphans = await orphanDetector.findOrphans();

    if (orphans.length > 0) {
      // Show notification
      Alert.alert(
        'Downloaded Books Cleanup',
        `${orphans.length} downloaded book(s) have been updated on the server. Would you like to remove the old versions?`,
        [
          { text: 'Keep', style: 'cancel' },
          {
            text: 'Remove',
            onPress: async () => {
              await orphanDetector.cleanupOrphans(orphans);
              await refreshDownloadedBooks();
            }
          }
        ]
      );
    }
  };

  checkOrphans();
}, []);
```

**Pros:**
- No backend changes required
- Simple implementation
- Automatically cleans up old downloads
- Works immediately

**Cons:**
- Users lose downloaded content
- No automatic migration to new version
- User must manually download new version
- Reading position lost

---

### Option 3: Manual Management (Minimal Changes)

**Concept**: Let users manage orphaned downloads themselves.

**Implementation:**

1. **Add indicator in Downloads screen**:
```typescript
// Show warning icon for books that no longer exist
{!bookExistsOnServer && (
  <View style={styles.warningBadge}>
    <Ionicons name="warning" size={16} color={colors.warning} />
    <Text style={styles.warningText}>No longer available</Text>
  </View>
)}
```

2. **Add explanation in Downloads screen**:
```
┌─────────────────────────────────────┐
│  ⚠️ Some downloaded books are no    │
│  longer available on the server.    │
│  They may have been updated to      │
│  newer versions. Check the Library  │
│  for current versions.              │
└─────────────────────────────────────┘
```

**Pros:**
- Minimal code changes
- No backend changes
- Users maintain control
- Transparent about what's happening

**Cons:**
- User experience not ideal
- Users may be confused
- Manual cleanup required
- Wasted storage space

---

## Recommended Implementation Plan

### Phase 1: Immediate (Before Release)
Implement **Option 2: Orphan Cleanup**
- Quick to implement
- No backend dependencies
- Solves the immediate problem
- Can be done in 1-2 hours

### Phase 2: Future Enhancement (v1.1 or v1.2)
Implement **Option 1: Version Detection & Migration**
- Coordinate with backend team
- Add version tracking to API
- Implement smart migration
- Better long-term solution

### Code Changes for Phase 1 (Option 2)

#### 1. Create OrphanDetector service:
```typescript
// src/services/offline/OrphanDetector.ts
import { offlineManager } from './OfflineManager';
import { booksApi } from '@/services/api/books';

export class OrphanDetector {
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

#### 2. Add to DownloadsScreen:
```typescript
// In DownloadsScreen.tsx
import { orphanDetector } from '@/services/offline/OrphanDetector';

const DownloadsScreen: React.FC<DownloadsScreenProps> = () => {
  // ... existing code

  useEffect(() => {
    const checkForOrphans = async () => {
      const orphans = await orphanDetector.findOrphans();

      if (orphans.length > 0) {
        Alert.alert(
          'Downloaded Books Update',
          `${orphans.length} downloaded book${orphans.length > 1 ? 's have' : ' has'} been updated on the server and ${orphans.length > 1 ? 'are' : 'is'} no longer available in the old version. Would you like to remove ${orphans.length > 1 ? 'them' : 'it'} from your downloads?`,
          [
            {
              text: 'Keep for Now',
              style: 'cancel'
            },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: async () => {
                await orphanDetector.cleanupOrphans(orphans);
                await loadDownloads(); // Refresh list
              }
            }
          ]
        );
      }
    };

    // Check for orphans when screen loads
    if (downloadedBooks.length > 0) {
      checkForOrphans();
    }
  }, [downloadedBooks.length]);

  // ... rest of component
};
```

#### 3. Add periodic check (optional):
```typescript
// In App.tsx or LibraryScreen.tsx
import { orphanDetector } from '@/services/offline/OrphanDetector';

// Run orphan check weekly
useEffect(() => {
  const checkOrphans = async () => {
    const lastCheck = await AsyncStorage.getItem('lastOrphanCheck');
    const now = Date.now();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;

    if (!lastCheck || now - parseInt(lastCheck) > weekInMs) {
      const orphans = await orphanDetector.findOrphans();
      if (orphans.length > 0) {
        // Show notification or badge
      }
      await AsyncStorage.setItem('lastOrphanCheck', now.toString());
    }
  };

  checkOrphans();
}, []);
```

---

## Testing Strategy

### Test Case 1: New Book Added
1. Note current book count in Library
2. Add new book via backend admin panel
3. Close and reopen mobile app
4. **Expected**: New book appears in appropriate category

### Test Case 2: Book Version Updated (Orphan Created)
1. Download a book (e.g., book_id: 100)
2. Delete book 100 from backend
3. Add new version as book_id: 101
4. Close and reopen mobile app
5. **Expected**:
   - Book 101 appears in Library
   - Book 100 not in Library
   - Orphan cleanup prompt appears (if implemented)
   - After cleanup, book 100 removed from Downloads

### Test Case 3: Offline Mode with Orphan
1. Download book_id: 100
2. Go offline (airplane mode)
3. Book 100 should still be readable from Downloads
4. **Expected**: Book reads normally from local storage

---

## User Communication

### In-App Messaging
Add a "What's New" section in About screen for v1.1:
```
Recent Updates:
• Smart book version detection
• Automatic cleanup of outdated downloads
• Improved offline reading experience
```

### App Store Release Notes
```
Version 1.1.0
• Added automatic detection of book updates
• Improved download management
• Bug fixes and performance improvements
```

---

## Monitoring & Analytics (Future)

Track these metrics to understand impact:
- Number of orphaned books detected per user
- Cleanup acceptance rate (users who click "Remove")
- Re-download rate after cleanup
- Support tickets related to "missing" books

---

## Related Documentation
- See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for testing procedures
- See [SECURITY.md](SECURITY.md) for API security considerations

## Last Updated
January 2026
