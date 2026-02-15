# Pure Bhakti Base Mobile App - Technical Architecture

**Version**: 1.0
**Date**: 2026-01-08
**Target Release**: MVP in 3-5 days
**Platforms**: iOS & Android (Simultaneous)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Image Management](#image-management)
9. [Storage Strategy](#storage-strategy)
10. [Navigation Architecture](#navigation-architecture)
11. [Performance Optimization](#performance-optimization)
12. [Implementation Phases](#implementation-phases)
13. [Development Workflow](#development-workflow)

---

## Executive Summary

### Project Goals

Build a spiritual library mobile app with **144 books** and **27,181 pages** that:
- Loads in < 2 seconds
- Provides smooth 60 FPS reading experience
- Works on WiFi and cellular networks
- Supports offline reading of recent pages
- Maintains consistency with existing web app

### Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Expo (React Native) | Fast development, easy updates, WebP support |
| **State Management** | Zustand + React Query | Simple, performant, built-in caching |
| **Navigation** | React Navigation v6 | Industry standard, deep linking support |
| **Images** | Expo Image | Native WebP, built-in caching, Expo integration |
| **Local Storage** | Expo SecureStore + SQLite | Bookmarks + metadata caching |
| **API Client** | Axios + React Query | Consistency with web app, caching layer |

### MVP Feature Set (Enhanced)

✅ **Core Features** (from requirements):
- Library with 3 category tabs
- Book search (title + author)
- Reader with WebP page viewer
- TOC navigation (bottom drawer on mobile)
- Page navigation with gestures
- Bookmarks with CRUD

✅ **Enhanced MVP Features** (high-value additions):
- Last read page tracking (auto-resume)
- Smart image preloading (WiFi-aware)
- Automatic page caching (last 5 pages)
- Native sharing with platform sheets
- Memory management (prevent crashes)

---

## Technology Stack

### Core Framework

```json
{
  "expo": "~54.0.31",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

### Navigation

```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17",
  "react-native-screens": "^3.29.0",
  "react-native-safe-area-context": "^4.8.2"
}
```

**Why**: Native stack navigator provides native transitions and gestures out of the box.

### State Management

```json
{
  "zustand": "^4.4.7",
  "@tanstack/react-query": "^5.17.19"
}
```

**Architecture**:
- **Zustand**: UI state, settings, bookmarks (synchronous state)
- **React Query**: API data, images (async state with caching)

**Why Zustand over Context API**:
- No provider hell
- Better performance (selective re-renders)
- Built-in middleware (persist, devtools)
- TypeScript-first design

**Why React Query**:
- Automatic caching and invalidation
- Request deduplication
- Background refetching
- Offline support with retry logic
- Loading/error states built-in

### Image Handling

```json
{
  "expo-image": "^1.10.1",
  "expo-image-manipulator": "^12.0.5",
  "react-native-gesture-handler": "^2.14.1",
  "react-native-reanimated": "^3.6.1"
}
```

**Features**:
- Native WebP decoding (hardware accelerated)
- Built-in disk + memory cache
- Blurhash placeholders
- Priority-based loading
- Automatic memory management

### Local Storage

```json
{
  "expo-secure-store": "^13.0.1",
  "expo-sqlite": "^14.0.3",
  "expo-file-system": "^17.0.1"
}
```

**Storage Strategy**:
- **SecureStore**: User preferences, bookmark data (encrypted)
- **SQLite**: Books metadata, TOC, page maps (queryable)
- **FileSystem**: Downloaded images for offline (large files)

### UI Components

```json
{
  "react-native-gesture-handler": "^2.14.1",
  "react-native-reanimated": "^3.6.1",
  "expo-haptics": "^13.0.1",
  "expo-sharing": "^12.0.1",
  "react-native-webp-format": "^1.2.1"
}
```

### Development Tools

```json
{
  "typescript": "^5.3.3",
  "@types/react": "^18.2.45",
  "eslint": "^8.56.0",
  "prettier": "^3.1.1"
}
```

---

## Project Structure

```
pbb_mobile/
├── App.tsx                           # Root component
├── app.json                          # Expo config
├── package.json
├── tsconfig.json
│
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # Main navigation container
│   │   ├── linking.ts               # Deep linking config
│   │   └── types.ts                 # Navigation type definitions
│   │
│   ├── screens/
│   │   ├── LibraryScreen.tsx        # Main library view
│   │   ├── ReaderScreen.tsx         # Book reader
│   │   └── SplashScreen.tsx         # Initial loading
│   │
│   ├── components/
│   │   ├── library/
│   │   │   ├── BookGrid.tsx         # Grid layout component
│   │   │   ├── BookCard.tsx         # Individual book card
│   │   │   ├── BookDetailsModal.tsx # Book details overlay
│   │   │   ├── CategoryTabs.tsx     # Tab navigation
│   │   │   ├── SearchBar.tsx        # Search input
│   │   │   └── EmptyState.tsx       # Empty/no results state
│   │   │
│   │   ├── reader/
│   │   │   ├── PageViewer.tsx       # Main page image display
│   │   │   ├── PageNavigation.tsx   # Nav bar with controls
│   │   │   ├── TOCDrawer.tsx        # Bottom slide-up TOC
│   │   │   ├── TOCTree.tsx          # Hierarchical TOC list
│   │   │   ├── FullscreenViewer.tsx # Fullscreen mode
│   │   │   ├── BookmarkButton.tsx   # Bookmark control
│   │   │   ├── ShareButton.tsx      # Share functionality
│   │   │   ├── GoToPageDialog.tsx   # Page jump modal
│   │   │   └── ZoomableImage.tsx    # Pinch-to-zoom wrapper
│   │   │
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx   # Loading indicator
│   │       ├── ErrorBoundary.tsx    # Error handling
│   │       ├── Button.tsx           # Custom button
│   │       ├── Modal.tsx            # Base modal component
│   │       └── GradientBackground.tsx
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance config
│   │   │   ├── books.ts             # Book API endpoints
│   │   │   ├── content.ts           # Content API endpoints
│   │   │   └── hooks.ts             # React Query hooks
│   │   │
│   │   ├── storage/
│   │   │   ├── bookmarks.ts         # Bookmark CRUD
│   │   │   ├── database.ts          # SQLite operations
│   │   │   ├── cache.ts             # Cache management
│   │   │   └── settings.ts          # App settings
│   │   │
│   │   └── image/
│   │       ├── preloader.ts         # Image preloading logic
│   │       ├── cache.ts             # Image cache management
│   │       └── optimizer.ts         # Image optimization
│   │
│   ├── stores/
│   │   ├── libraryStore.ts          # Library UI state
│   │   ├── readerStore.ts           # Reader UI state
│   │   ├── bookmarkStore.ts         # Bookmarks state
│   │   └── settingsStore.ts         # App settings
│   │
│   ├── hooks/
│   │   ├── useBooks.ts              # Books query hook
│   │   ├── useReader.ts             # Reader logic hook
│   │   ├── useBookmarks.ts          # Bookmarks hook
│   │   ├── useImagePreload.ts       # Preloading hook
│   │   ├── useLastReadPage.ts       # Reading progress hook
│   │   └── useNetworkStatus.ts      # Network monitoring
│   │
│   ├── utils/
│   │   ├── constants.ts             # App constants
│   │   ├── helpers.ts               # Utility functions
│   │   ├── validators.ts            # Input validation
│   │   ├── formatters.ts            # Data formatting
│   │   └── logger.ts                # Logging utility
│   │
│   ├── types/
│   │   ├── api.ts                   # API response types
│   │   ├── models.ts                # Data models
│   │   ├── navigation.ts            # Navigation types
│   │   └── common.ts                # Common types
│   │
│   ├── config/
│   │   ├── api.config.ts            # API configuration
│   │   ├── image.config.ts          # Image settings
│   │   └── app.config.ts            # App-wide config
│   │
│   ├── theme/
│   │   ├── colors.ts                # Color palette
│   │   ├── typography.ts            # Font styles
│   │   ├── spacing.ts               # Layout spacing
│   │   └── index.ts                 # Theme exports
│   │
│   └── assets/
│       ├── images/                   # Static images
│       ├── icons/                    # Icon files
│       └── fonts/                    # Custom fonts
│
├── docs/                             # Documentation
│   ├── MOBILE_APP_REQUIREMENTS.md
│   ├── MOBILE_API_DOCUMENTATION.md
│   ├── WEBP_IMAGE_ANALYSIS.md
│   └── ARCHITECTURE.md (this file)
│
└── __tests__/                        # Test files
    ├── components/
    ├── services/
    └── utils/
```

---

## Architecture Patterns

### 1. Component Architecture

**Container/Presentational Pattern**:

```typescript
// Screen (Container) - Logic + Data
const LibraryScreen = () => {
  const { books, isLoading } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <LibraryView
      books={books}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    />
  );
};

// Component (Presentational) - UI Only
const LibraryView = ({ books, isLoading, searchTerm, onSearchChange }) => {
  return (
    <View>
      <SearchBar value={searchTerm} onChange={onSearchChange} />
      <BookGrid books={books} isLoading={isLoading} />
    </View>
  );
};
```

### 2. Data Fetching Pattern

**React Query + Custom Hooks**:

```typescript
// services/api/hooks.ts
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useBookPages = (bookId: number) => {
  return useQuery({
    queryKey: ['book', bookId, 'pages'],
    queryFn: () => fetchBookPages(bookId),
    enabled: !!bookId,
  });
};

// Usage in component
const { data: books, isLoading, error } = useBooks();
```

### 3. State Management Pattern

**Zustand Stores**:

```typescript
// stores/readerStore.ts
interface ReaderState {
  currentBookId: number | null;
  currentPage: number;
  isTOCOpen: boolean;
  isFullscreen: boolean;

  // Actions
  setCurrentBook: (bookId: number, page?: number) => void;
  setCurrentPage: (page: number) => void;
  toggleTOC: () => void;
  toggleFullscreen: () => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  currentBookId: null,
  currentPage: 1,
  isTOCOpen: false,
  isFullscreen: false,

  setCurrentBook: (bookId, page = 1) => set({
    currentBookId: bookId,
    currentPage: page
  }),
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleTOC: () => set((state) => ({ isTOCOpen: !state.isTOCOpen })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
}));
```

### 4. Image Loading Pattern

**Progressive Loading with Priorities**:

```typescript
// components/reader/PageViewer.tsx
const PageViewer = ({ bookId, pageNumber }) => {
  const imageUrl = getPageImageUrl(bookId, pageNumber);

  return (
    <ExpoImage
      source={{ uri: imageUrl }}
      placeholder={blurhash}
      priority="high"
      cachePolicy="memory-disk"
      transition={200}
      style={styles.image}
    />
  );
};

// Preload adjacent pages
useImagePreload({
  bookId,
  currentPage: pageNumber,
  preloadCount: 2,
  onlyOnWifi: true,
});
```

---

## Data Flow

### Book Reading Flow

```
┌─────────────────┐
│  User Action    │
│  (Select Book)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Navigation                         │
│  push('Reader', { bookId: 2 })      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  ReaderScreen                       │
│  - Extract route params             │
│  - Initialize hooks                 │
└────────┬────────────────────────────┘
         │
         ├───────┬──────────┬─────────┐
         ▼       ▼          ▼         ▼
    ┌────────┐ ┌────┐  ┌─────┐  ┌────────┐
    │ Book   │ │TOC │  │Pages│  │Last    │
    │ Data   │ │Data│  │ Map │  │Read    │
    └───┬────┘ └─┬──┘  └──┬──┘  └───┬────┘
        │        │        │         │
        │        │        │         │
        ▼        ▼        ▼         ▼
    ┌─────────────────────────────────┐
    │  React Query Cache              │
    │  - Check cache first            │
    │  - Fetch if missing/stale       │
    │  - Return data                  │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  API Layer (Axios)              │
    │  GET /api/v1/books/2            │
    │  GET /api/v1/books/2/toc        │
    │  GET /api/v1/books/2/pages      │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  Backend API                    │
    │  https://purebhaktibase.com:8443│
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  Response                       │
    │  - Book metadata                │
    │  - TOC structure                │
    │  - Page list                    │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  SQLite Cache (Optional)        │
    │  - Store for offline access     │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  UI Rendering                   │
    │  - Display TOC                  │
    │  - Show current page image      │
    │  - Enable navigation            │
    └─────────────────────────────────┘
```

### Image Loading Flow

```
┌─────────────────┐
│  Page Change    │
│  (page = 42)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Priority Queue                     │
│  1. Current page (42) - HIGH        │
│  2. Next page (43) - MEDIUM         │
│  3. Previous page (41) - MEDIUM     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Expo Image Cache Check             │
│  - Memory cache hit? → Display      │
│  - Disk cache hit? → Load & Display │
│  - Cache miss? → Fetch from network │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Network Fetch                      │
│  https://purebhaktibase.com/        │
│  pbb_book_pages/2/42.webp           │
│  (Average: 123 KB)                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Image Processing                   │
│  - Decode WebP (hardware accelerated)│
│  - Store in memory cache            │
│  - Save to disk cache               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Render with Transition             │
│  - Fade in animation (200ms)        │
│  - Enable zoom/pan gestures         │
└─────────────────────────────────────┘
```

---

## State Management

### Zustand Stores

#### 1. Library Store

```typescript
// stores/libraryStore.ts
interface LibraryState {
  activeTab: 'english' | 'tamil' | 'rays';
  searchTerm: string;
  selectedBook: Book | null;
  isDetailsModalOpen: boolean;

  setActiveTab: (tab: LibraryState['activeTab']) => void;
  setSearchTerm: (term: string) => void;
  openBookDetails: (book: Book) => void;
  closeBookDetails: () => void;
}
```

#### 2. Reader Store

```typescript
// stores/readerStore.ts
interface ReaderState {
  currentBookId: number | null;
  currentPage: number;
  isTOCOpen: boolean;
  isFullscreen: boolean;
  isGoToPageOpen: boolean;
  zoomLevel: number;

  // Actions
  setCurrentBook: (bookId: number, page?: number) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  toggleTOC: () => void;
  toggleFullscreen: () => void;
  openGoToPage: () => void;
  closeGoToPage: () => void;
  setZoomLevel: (level: number) => void;
}
```

#### 3. Bookmark Store (Persisted)

```typescript
// stores/bookmarkStore.ts
interface Bookmark {
  id: string;
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  pageLabel?: string;
  customName?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookmarkState {
  bookmarks: Bookmark[];

  addBookmark: (data: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  isPageBookmarked: (bookId: number, page: number) => boolean;
  getBookmarksByBook: (bookId: number) => Bookmark[];
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (data) => set((state) => ({
        bookmarks: [
          ...state.bookmarks,
          {
            ...data,
            id: `bm_${Date.now()}_${Math.random()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
      })),

      // ... other methods
    }),
    {
      name: 'bookmarks-storage',
      storage: createJSONStorage(() => SecureStore),
    }
  )
);
```

#### 4. Settings Store (Persisted)

```typescript
// stores/settingsStore.ts
interface SettingsState {
  preloadOnCellular: boolean;
  preloadCount: number;
  cacheSize: number; // MB
  theme: 'light' | 'dark' | 'auto';

  updateSettings: (updates: Partial<SettingsState>) => void;
}
```

### React Query Queries

```typescript
// services/api/hooks.ts

// Books query
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/books?page=1&size=200');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Book detail query
export const useBook = (bookId: number) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/books/${bookId}`);
      return response.data;
    },
    enabled: !!bookId,
  });
};

// TOC query
export const useBookTOC = (bookId: number) => {
  return useQuery({
    queryKey: ['book', bookId, 'toc'],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/books/${bookId}/toc`);
      return response.data;
    },
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000, // TOC rarely changes
  });
};

// Pages query
export const useBookPages = (bookId: number) => {
  return useQuery({
    queryKey: ['book', bookId, 'pages'],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/books/${bookId}/pages`);
      return response.data;
    },
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000,
  });
};
```

---

## API Integration

### API Client Configuration

```typescript
// services/api/client.ts
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status}`);
    } else if (error.request) {
      console.error('[API Error] No response');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Service Layer

```typescript
// services/api/books.ts
import apiClient from './client';
import { Book, BookListResponse } from '@/types/api';

export const booksApi = {
  async getAll(page = 1, size = 200): Promise<BookListResponse> {
    const response = await apiClient.get('/api/v1/books', {
      params: { page, size },
    });
    return response.data;
  },

  async getById(bookId: number): Promise<Book> {
    const response = await apiClient.get(`/api/v1/books/${bookId}`);
    return response.data;
  },

  async getTOC(bookId: number) {
    const response = await apiClient.get(`/api/v1/books/${bookId}/toc`);
    return response.data;
  },

  async getPages(bookId: number) {
    const response = await apiClient.get(`/api/v1/books/${bookId}/pages`);
    return response.data;
  },
};
```

---

## Image Management

### Image URLs

```typescript
// config/image.config.ts
export const IMAGE_CONFIG = {
  baseURL: 'https://purebhaktibase.com',

  getBookThumbnail: (bookId: number) =>
    `${IMAGE_CONFIG.baseURL}/pbb_book_thumbnails/${bookId}.jpg`,

  getBookPage: (bookId: number, pageNumber: number) =>
    `${IMAGE_CONFIG.baseURL}/pbb_book_pages/${bookId}/${pageNumber}.webp`,

  cache: {
    maxSize: 100 * 1024 * 1024, // 100 MB
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};
```

### Image Preloading Hook

```typescript
// hooks/useImagePreload.ts
import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useNetworkStatus } from './useNetworkStatus';
import { IMAGE_CONFIG } from '@/config/image.config';

interface UseImagePreloadOptions {
  bookId: number;
  currentPage: number;
  preloadCount?: number;
  onlyOnWifi?: boolean;
  enabled?: boolean;
}

export const useImagePreload = ({
  bookId,
  currentPage,
  preloadCount = 2,
  onlyOnWifi = true,
  enabled = true,
}: UseImagePreloadOptions) => {
  const { isWifi } = useNetworkStatus();

  useEffect(() => {
    if (!enabled) return;
    if (onlyOnWifi && !isWifi) return;

    const pagesToPreload: number[] = [];

    // Preload next pages (priority)
    for (let i = 1; i <= preloadCount; i++) {
      pagesToPreload.push(currentPage + i);
    }

    // Preload previous pages (lower priority)
    for (let i = 1; i <= Math.min(preloadCount - 1, 1); i++) {
      if (currentPage - i > 0) {
        pagesToPreload.push(currentPage - i);
      }
    }

    // Prefetch images
    const urls = pagesToPreload.map(page =>
      IMAGE_CONFIG.getBookPage(bookId, page)
    );

    Image.prefetch(urls);
  }, [bookId, currentPage, preloadCount, isWifi, onlyOnWifi, enabled]);
};
```

### Zoomable Image Component

```typescript
// components/reader/ZoomableImage.tsx
import React from 'react';
import { Image } from 'expo-image';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface ZoomableImageProps {
  uri: string;
  onDoubleTap?: () => void;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  uri,
  onDoubleTap,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      // Reset if zoomed out too much
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      }

      // Limit max zoom
      if (scale.value > 3) {
        scale.value = withTiming(3);
        savedScale.value = 3;
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
      onDoubleTap?.();
    });

  const composed = Gesture.Race(doubleTapGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
          priority="high"
          cachePolicy="memory-disk"
          transition={200}
        />
      </Animated.View>
    </GestureDetector>
  );
};
```

---

## Storage Strategy

### 1. Bookmarks (SecureStore)

```typescript
// services/storage/bookmarks.ts
import * as SecureStore from 'expo-secure-store';

const BOOKMARKS_KEY = 'pbb_bookmarks';

export const bookmarksStorage = {
  async getAll(): Promise<Bookmark[]> {
    const data = await SecureStore.getItemAsync(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async save(bookmarks: Bookmark[]): Promise<void> {
    await SecureStore.setItemAsync(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  },

  async add(bookmark: Bookmark): Promise<void> {
    const bookmarks = await this.getAll();
    bookmarks.push(bookmark);
    await this.save(bookmarks);
  },

  async remove(id: string): Promise<void> {
    const bookmarks = await this.getAll();
    const filtered = bookmarks.filter(b => b.id !== id);
    await this.save(filtered);
  },
};
```

### 2. Last Read Pages (SecureStore)

```typescript
// services/storage/reading-progress.ts
import * as SecureStore from 'expo-secure-store';

const PROGRESS_KEY = 'pbb_reading_progress';

interface ReadingProgress {
  [bookId: number]: {
    page: number;
    timestamp: string;
  };
}

export const readingProgressStorage = {
  async get(bookId: number): Promise<number> {
    const data = await SecureStore.getItemAsync(PROGRESS_KEY);
    const progress: ReadingProgress = data ? JSON.parse(data) : {};
    return progress[bookId]?.page || 1;
  },

  async set(bookId: number, page: number): Promise<void> {
    const data = await SecureStore.getItemAsync(PROGRESS_KEY);
    const progress: ReadingProgress = data ? JSON.parse(data) : {};

    progress[bookId] = {
      page,
      timestamp: new Date().toISOString(),
    };

    await SecureStore.setItemAsync(PROGRESS_KEY, JSON.stringify(progress));
  },
};
```

### 3. Books Cache (SQLite - Optional for MVP)

```typescript
// services/storage/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('pbb.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL,
      cached_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS book_pages (
      book_id INTEGER,
      page_number INTEGER,
      page_label TEXT,
      PRIMARY KEY (book_id, page_number)
    );

    CREATE TABLE IF NOT EXISTS toc (
      book_id INTEGER,
      toc_id INTEGER,
      data TEXT NOT NULL,
      PRIMARY KEY (book_id, toc_id)
    );
  `);
};

export const booksCache = {
  async saveBook(bookId: number, data: any) {
    db.runSync(
      'INSERT OR REPLACE INTO books (id, data, cached_at) VALUES (?, ?, ?)',
      [bookId, JSON.stringify(data), new Date().toISOString()]
    );
  },

  async getBook(bookId: number) {
    const result = db.getFirstSync(
      'SELECT data FROM books WHERE id = ?',
      [bookId]
    );
    return result ? JSON.parse(result.data) : null;
  },
};
```

---

## Navigation Architecture

### Navigation Structure

```typescript
// navigation/types.ts
export type RootStackParamList = {
  Library: undefined;
  Reader: {
    bookId: number;
    page?: number;
  };
};

// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{
            animation: 'fade',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### Deep Linking Configuration

```typescript
// navigation/linking.ts
import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'purebhaktibase://'],
  config: {
    screens: {
      Library: '',
      Reader: {
        path: 'reader/:bookId',
        parse: {
          bookId: Number,
          page: Number,
        },
      },
    },
  },
};
```

---

## Performance Optimization

### 1. List Virtualization

```typescript
// components/library/BookGrid.tsx
import { FlashList } from '@shopify/flash-list';

export const BookGrid = ({ books }) => {
  return (
    <FlashList
      data={books}
      renderItem={({ item }) => <BookCard book={item} />}
      estimatedItemSize={200}
      numColumns={2}
      keyExtractor={(item) => item.book_id.toString()}
    />
  );
};
```

### 2. Image Optimization

```typescript
// Use Expo Image with optimized settings
<Image
  source={{ uri: imageUrl }}
  cachePolicy="memory-disk"
  priority="high"
  placeholderContentFit="cover"
  transition={200}
/>
```

### 3. Memoization

```typescript
// Use React.memo for expensive components
export const BookCard = React.memo(({ book }) => {
  // Component logic
}, (prevProps, nextProps) => prevProps.book.book_id === nextProps.book.book_id);
```

### 4. Debounced Search

```typescript
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebouncedValue(searchTerm, 300);

// Use debouncedSearch for filtering
```

---

## Implementation Phases

### Phase 1: Foundation (Day 1)
- ✅ Project setup with Expo
- ✅ Install all dependencies
- ✅ Configure TypeScript
- ✅ Set up project structure
- ✅ Configure navigation
- ✅ Set up API client
- ✅ Configure image loading

### Phase 2: Library Feature (Day 2)
- ✅ Implement LibraryScreen
- ✅ Create BookGrid component
- ✅ Create BookCard component
- ✅ Implement CategoryTabs
- ✅ Add SearchBar
- ✅ Create BookDetailsModal
- ✅ Integrate books API
- ✅ Add loading/error states

### Phase 3: Reader Foundation (Day 3)
- ✅ Implement ReaderScreen
- ✅ Create PageViewer component
- ✅ Implement ZoomableImage
- ✅ Create PageNavigation component
- ✅ Add prev/next navigation
- ✅ Integrate page API
- ✅ Add image preloading

### Phase 4: TOC & Navigation (Day 4)
- ✅ Implement TOCDrawer (bottom sheet)
- ✅ Create TOCTree component
- ✅ Add TOC navigation
- ✅ Implement GoToPageDialog
- ✅ Add swipe gestures
- ✅ Integrate TOC API

### Phase 5: Features & Polish (Day 5)
- ✅ Implement bookmarks
- ✅ Add last read tracking
- ✅ Implement sharing
- ✅ Add fullscreen mode
- ✅ Performance optimization
- ✅ Bug fixes and testing
- ✅ Prepare for release

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

### Build for Production

```bash
# iOS build
eas build --platform ios

# Android build
eas build --platform android
```

---

## Next Steps

1. **Review & Approve** this architecture document
2. **Start Implementation** following the 5-day plan
3. **Daily Check-ins** to track progress and adjust
4. **Testing** on real devices throughout development
5. **Release** MVP for user feedback

---

**Document Status**: Ready for Review
**Last Updated**: 2026-01-08
**Next Review**: After implementation begins
