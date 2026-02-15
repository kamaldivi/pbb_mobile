# Pure Bhakti Vault API - Mobile Integration Documentation

Complete API documentation for integrating Pure Bhakti Vault APIs with Expo React Native mobile applications.

## Table of Contents

- [Overview](#overview)
- [Base Configuration](#base-configuration)
- [TypeScript Interfaces](#typescript-interfaces)
- [API Endpoints](#api-endpoints)
  - [Books](#books)
  - [Content](#content)
  - [Glossary](#glossary)
  - [Page Maps](#page-maps)
  - [Table of Contents](#table-of-contents)
  - [Health Check](#health-check)
- [API Client Implementation](#api-client-implementation)
- [Pagination Strategy](#pagination-strategy)
- [Error Handling](#error-handling)
- [Best Practices for Mobile](#best-practices-for-mobile)
- [Common Use Cases](#common-use-cases)

---

## Overview

**API Version**: 1.0.0
**Base URL (Production)**: `https://purebhaktibase.com:8443`
**Base URL (Development)**: `http://localhost:8000`
**Documentation**: `https://purebhaktibase.com:8443/docs`

### Key Features

- No authentication required
- CORS enabled for React Native Metro and mobile apps
- Comprehensive pagination support
- Semantic search powered by AI embeddings
- RESTful design with predictable endpoints

---

## Base Configuration

### Environment Setup

```typescript
// config/api.config.ts
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8000',
    timeout: 10000,
  },
  production: {
    baseURL: 'https://purebhaktibase.com:8443',
    timeout: 15000,
  },
};

export const getApiConfig = () => {
  return __DEV__ ? API_CONFIG.development : API_CONFIG.production;
};
```

### Axios Setup for React Native

```typescript
// services/api.service.ts
import axios from 'axios';
import { getApiConfig } from '../config/api.config';

const apiClient = axios.create({
  baseURL: getApiConfig().baseURL,
  timeout: getApiConfig().timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status}: ${error.response.data.detail}`);
    } else if (error.request) {
      console.error('[API Error] No response received');
    } else {
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## TypeScript Interfaces

### Core Data Models

```typescript
// types/api.types.ts

export interface Book {
  book_id: number;
  pdf_name: string;
  original_book_title: string;
  english_book_title: string | null;
  edition: string | null;
  number_of_pages: number;
  file_size_bytes: number | null;
  original_author: string | null;
  commentary_author: string | null;
  header_height: number | null;
  footer_height: number | null;
  created_at: string | null;
  updated_at: string | null;
  page_label_location: string | null;
  toc_pages: string | null; // Format: "1-10"
  verse_pages: string | null;
  glossary_pages: string | null;
  book_summary: string | null;
  book_type: string | null;
}

export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  size: number;
}

export interface Content {
  content_id: number;
  book_id: number;
  page_number: number;
  page_content: string | null;
  ai_page_content: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ContentResponse {
  content: Content | null;
  message?: string;
}

export interface ContentListResponse {
  content: Content[];
  total: number;
  page: number;
  size: number;
  book_id: number;
}

export interface GlossaryWithBook {
  glossary_id: number;
  book_id: number;
  term: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
  book_name: string;
}

export interface GlossaryListResponse {
  glossary_terms: GlossaryWithBook[];
  total: number;
  page: number;
  size: number;
  book_id: number;
}

export interface GlossaryTermResponse {
  term: GlossaryWithBook | null;
  message?: string;
}

export interface GlossarySearchRequest {
  query: string;
  limit?: number; // 1-20, default: 5
  book_id?: number | null;
}

export interface GlossarySearchResult {
  term: string;
  description: string;
  book_name: string;
  book_id: number;
}

export interface GlossarySearchResponse {
  results: GlossarySearchResult[];
  total_found: number;
  query: string;
  message?: string;
}

export interface PageMap {
  page_map_id: number;
  book_id: number;
  page_number: number;
  page_label: string | null;
  page_type: string; // "Core", "Primary", "Front Matter", etc.
  page_header: string | null;
  created_at: string | null;
}

export interface CorePageInfo {
  page_number: number;
  page_label: string | null;
}

export interface CorePagesResponse {
  pages: CorePageInfo[];
  total: number;
  book_id: number;
}

export interface FullPageMapResponse {
  page_maps: PageMap[];
  total: number;
  page: number;
  size: number;
  book_id: number;
}

export interface TableOfContents {
  toc_id: number;
  book_id: number;
  parent_toc_id: number | null;
  toc_level: number | null;
  toc_label: string | null;
  page_label: string | null;
  page_number: number | null;
}

export interface TocResponse {
  table_of_contents: TableOfContents[];
  total: number;
  book_id: number;
}

export interface TocListResponse {
  table_of_contents: TableOfContents[];
  total: number;
  page: number;
  size: number;
  book_id: number;
}

export interface GlossaryEmbeddingMeta {
  glossary_id: number;
  book_id: number;
  term: string;
  created_at: string;
  updated_at: string;
}

export interface GlossaryEmbeddingsResponse {
  embeddings: GlossaryEmbeddingMeta[];
  total: number;
  page: number;
  size: number;
  book_id: number;
}

export interface EmbeddingsStats {
  total_embeddings: number;
  books_with_embeddings: number;
  book_breakdown: Array<{
    book_id: number;
    book_name: string;
    embedding_count: number;
  }>;
}

export interface HealthCheck {
  status: string;
  service: string;
}

export interface ApiError {
  detail: string;
}
```

---

## API Endpoints

### Books

#### 1. Get All Books (Paginated)

**Endpoint**: `GET /api/v1/books`

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `size` (integer, default: 10, max: 100): Items per page

**Response**: `BookListResponse`

**Example**:

```typescript
import apiClient from '../services/api.service';
import { BookListResponse } from '../types/api.types';

const getBooks = async (page: number = 1, size: number = 10): Promise<BookListResponse> => {
  const response = await apiClient.get<BookListResponse>('/api/v1/books', {
    params: { page, size },
  });
  return response.data;
};

// Usage
const books = await getBooks(1, 20);
console.log(`Total books: ${books.total}`);
console.log(`Showing page ${books.page} of ${Math.ceil(books.total / books.size)}`);
```

#### 2. Get Book by ID

**Endpoint**: `GET /api/v1/books/{book_id}`

**Path Parameters**:
- `book_id` (integer): Book ID

**Response**: `Book`

**Example**:

```typescript
const getBookById = async (bookId: number): Promise<Book> => {
  const response = await apiClient.get<Book>(`/api/v1/books/${bookId}`);
  return response.data;
};

// Usage
const book = await getBookById(2);
console.log(book.original_book_title);
console.log(book.book_summary);
```

---

### Content

#### 3. Get Book Content (Paginated)

**Endpoint**: `GET /api/v1/books/{book_id}/content`

**Path Parameters**:
- `book_id` (integer): Book ID

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `size` (integer, default: 10, max: 100): Items per page

**Response**: `ContentListResponse`

**Example**:

```typescript
const getBookContent = async (
  bookId: number,
  page: number = 1,
  size: number = 10
): Promise<ContentListResponse> => {
  const response = await apiClient.get<ContentListResponse>(
    `/api/v1/books/${bookId}/content`,
    { params: { page, size } }
  );
  return response.data;
};

// Usage - load first 50 pages
const content = await getBookContent(2, 1, 50);
```

#### 4. Get Single Page Content

**Endpoint**: `GET /api/v1/books/{book_id}/content/{page_number}`

**Path Parameters**:
- `book_id` (integer): Book ID
- `page_number` (integer): Page number

**Response**: `ContentResponse`

**Example**:

```typescript
const getPageContent = async (
  bookId: number,
  pageNumber: number
): Promise<ContentResponse> => {
  const response = await apiClient.get<ContentResponse>(
    `/api/v1/books/${bookId}/content/${pageNumber}`
  );
  return response.data;
};

// Usage - get page 42 of book 2
const pageData = await getPageContent(2, 42);
if (pageData.content) {
  console.log(pageData.content.ai_page_content); // AI-processed text
  console.log(pageData.content.page_content); // Original text
}
```

---

### Glossary

#### 5. Get Book Glossary (Paginated)

**Endpoint**: `GET /api/v1/books/{book_id}/glossary`

**Path Parameters**:
- `book_id` (integer): Book ID

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `size` (integer, default: 10, max: 100): Items per page

**Response**: `GlossaryListResponse`

**Example**:

```typescript
const getBookGlossary = async (
  bookId: number,
  page: number = 1,
  size: number = 50
): Promise<GlossaryListResponse> => {
  const response = await apiClient.get<GlossaryListResponse>(
    `/api/v1/books/${bookId}/glossary`,
    { params: { page, size } }
  );
  return response.data;
};

// Usage - get all glossary terms (may need multiple requests)
const glossary = await getBookGlossary(2, 1, 100);
```

#### 6. Get Specific Glossary Term

**Endpoint**: `GET /api/v1/books/{book_id}/glossary/{term}`

**Path Parameters**:
- `book_id` (integer): Book ID
- `term` (string): Glossary term to search for

**Response**: `GlossaryTermResponse`

**Example**:

```typescript
const getGlossaryTerm = async (
  bookId: number,
  term: string
): Promise<GlossaryTermResponse> => {
  const encodedTerm = encodeURIComponent(term);
  const response = await apiClient.get<GlossaryTermResponse>(
    `/api/v1/books/${bookId}/glossary/${encodedTerm}`
  );
  return response.data;
};

// Usage
const termData = await getGlossaryTerm(2, 'bhakti');
if (termData.term) {
  console.log(termData.term.description);
}
```

#### 7. Semantic Glossary Search (Recommended)

**Endpoint**: `POST /api/v1/glossary/search`

**Request Body**: `GlossarySearchRequest`

**Response**: `GlossarySearchResponse`

**Features**:
- AI-powered semantic search using embeddings
- Falls back to text search if semantic search fails
- Searches across all books or filtered by book_id
- Understands context and meaning (e.g., "purification ritual" finds "ācamana")

**Example**:

```typescript
const searchGlossary = async (
  query: string,
  limit: number = 5,
  bookId?: number
): Promise<GlossarySearchResponse> => {
  const response = await apiClient.post<GlossarySearchResponse>(
    '/api/v1/glossary/search',
    {
      query,
      limit,
      book_id: bookId || null,
    }
  );
  return response.data;
};

// Usage examples
const results1 = await searchGlossary('devotional songs', 10);
// Returns terms like "bhajana", "kīrtana"

const results2 = await searchGlossary('spiritual teacher', 5, 2);
// Returns terms like "guru", "ācārya" from book 2 only
```

#### 8. Get Glossary Embeddings Metadata

**Endpoint**: `GET /api/v1/books/{book_id}/glossary/embeddings`

**Path Parameters**:
- `book_id` (integer): Book ID

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `size` (integer, default: 10, max: 100): Items per page

**Response**: `GlossaryEmbeddingsResponse`

**Note**: Returns metadata only (no actual embedding vectors for performance)

**Example**:

```typescript
const getGlossaryEmbeddings = async (
  bookId: number,
  page: number = 1,
  size: number = 10
): Promise<GlossaryEmbeddingsResponse> => {
  const response = await apiClient.get<GlossaryEmbeddingsResponse>(
    `/api/v1/books/${bookId}/glossary/embeddings`,
    { params: { page, size } }
  );
  return response.data;
};
```

#### 9. Get Embeddings Statistics

**Endpoint**: `GET /api/v1/glossary/embeddings/stats`

**Response**: `EmbeddingsStats`

**Example**:

```typescript
const getEmbeddingsStats = async (): Promise<EmbeddingsStats> => {
  const response = await apiClient.get<EmbeddingsStats>(
    '/api/v1/glossary/embeddings/stats'
  );
  return response.data;
};

// Usage - check which books have semantic search available
const stats = await getEmbeddingsStats();
console.log(`Total embeddings: ${stats.total_embeddings}`);
stats.book_breakdown.forEach(book => {
  console.log(`${book.book_name}: ${book.embedding_count} terms`);
});
```

#### 10. Legacy Text Search

**Endpoint**: `GET /api/v1/glossary/search-legacy`

**Query Parameters**:
- `term` (string, required): Term to search for
- `page` (integer, default: 1): Page number
- `size` (integer, default: 10, max: 100): Items per page

**Response**: Legacy format (use `/glossary/search` instead)

**Note**: Deprecated - Use POST `/api/v1/glossary/search` for better results

---

### Page Maps

#### 11. Get Core Pages

**Endpoint**: `GET /api/v1/books/{book_id}/pages/core`

**Path Parameters**:
- `book_id` (integer): Book ID

**Response**: `CorePagesResponse`

**Purpose**: Get all page numbers and labels for Core pages (main content) of a book. Falls back to Primary pages if Core pages not found.

**Example**:

```typescript
const getCorePages = async (bookId: number): Promise<CorePagesResponse> => {
  const response = await apiClient.get<CorePagesResponse>(
    `/api/v1/books/${bookId}/pages/core`
  );
  return response.data;
};

// Usage - useful for navigation
const corePages = await getCorePages(2);
corePages.pages.forEach(page => {
  console.log(`Page ${page.page_number}: ${page.page_label}`);
});
```

#### 12. Get Full Page Map

**Endpoint**: `GET /api/v1/books/{book_id}/pages`

**Path Parameters**:
- `book_id` (integer): Book ID

**Response**: `FullPageMapResponse`

**Purpose**: Get complete page map including all page types (Core, Front Matter, TOC, Glossary, etc.)

**Example**:

```typescript
const getFullPageMap = async (bookId: number): Promise<FullPageMapResponse> => {
  const response = await apiClient.get<FullPageMapResponse>(
    `/api/v1/books/${bookId}/pages`
  );
  return response.data;
};

// Usage - filter by page type
const pageMap = await getFullPageMap(2);
const frontMatter = pageMap.page_maps.filter(p => p.page_type === 'Front Matter');
const corePages = pageMap.page_maps.filter(p => p.page_type === 'Core');
```

---

### Table of Contents

#### 13. Get Full Table of Contents

**Endpoint**: `GET /api/v1/books/{book_id}/toc`

**Path Parameters**:
- `book_id` (integer): Book ID

**Response**: `TocResponse`

**Purpose**: Get complete table of contents for a book (all entries, no pagination)

**Example**:

```typescript
const getTableOfContents = async (bookId: number): Promise<TocResponse> => {
  const response = await apiClient.get<TocResponse>(
    `/api/v1/books/${bookId}/toc`
  );
  return response.data;
};

// Usage - build hierarchical navigation
const toc = await getTableOfContents(2);

// Group by level for nested navigation
const buildTocTree = (entries: TableOfContents[]) => {
  const tree: any = {};
  entries.forEach(entry => {
    if (!tree[entry.toc_level || 0]) {
      tree[entry.toc_level || 0] = [];
    }
    tree[entry.toc_level || 0].push(entry);
  });
  return tree;
};

const tocTree = buildTocTree(toc.table_of_contents);
```

#### 14. Get Paginated Table of Contents

**Endpoint**: `GET /api/v1/books/{book_id}/toc/paginated`

**Path Parameters**:
- `book_id` (integer): Book ID

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `size` (integer, default: 50, max: 200): Items per page

**Response**: `TocListResponse`

**Example**:

```typescript
const getPaginatedToc = async (
  bookId: number,
  page: number = 1,
  size: number = 50
): Promise<TocListResponse> => {
  const response = await apiClient.get<TocListResponse>(
    `/api/v1/books/${bookId}/toc/paginated`,
    { params: { page, size } }
  );
  return response.data;
};
```

---

### Health Check

#### 15. Health Check

**Endpoint**: `GET /health`

**Response**: `HealthCheck`

**Example**:

```typescript
const checkHealth = async (): Promise<HealthCheck> => {
  const response = await apiClient.get<HealthCheck>('/health');
  return response.data;
};

// Usage - app initialization check
const health = await checkHealth();
if (health.status === 'healthy') {
  console.log('API is ready');
}
```

#### 16. Root Endpoint

**Endpoint**: `GET /`

**Response**: API information

**Example**:

```typescript
const getApiInfo = async () => {
  const response = await apiClient.get('/');
  return response.data;
};
```

---

## API Client Implementation

### Complete API Service Class

```typescript
// services/pureBhaktiApi.service.ts
import apiClient from './api.service';
import {
  BookListResponse,
  Book,
  ContentListResponse,
  ContentResponse,
  GlossaryListResponse,
  GlossaryTermResponse,
  GlossarySearchRequest,
  GlossarySearchResponse,
  CorePagesResponse,
  FullPageMapResponse,
  TocResponse,
  TocListResponse,
  GlossaryEmbeddingsResponse,
  EmbeddingsStats,
  HealthCheck,
} from '../types/api.types';

class PureBhaktiApiService {
  // Books
  async getBooks(page: number = 1, size: number = 10): Promise<BookListResponse> {
    const response = await apiClient.get<BookListResponse>('/api/v1/books', {
      params: { page, size },
    });
    return response.data;
  }

  async getBookById(bookId: number): Promise<Book> {
    const response = await apiClient.get<Book>(`/api/v1/books/${bookId}`);
    return response.data;
  }

  // Content
  async getBookContent(
    bookId: number,
    page: number = 1,
    size: number = 10
  ): Promise<ContentListResponse> {
    const response = await apiClient.get<ContentListResponse>(
      `/api/v1/books/${bookId}/content`,
      { params: { page, size } }
    );
    return response.data;
  }

  async getPageContent(bookId: number, pageNumber: number): Promise<ContentResponse> {
    const response = await apiClient.get<ContentResponse>(
      `/api/v1/books/${bookId}/content/${pageNumber}`
    );
    return response.data;
  }

  // Glossary
  async getBookGlossary(
    bookId: number,
    page: number = 1,
    size: number = 50
  ): Promise<GlossaryListResponse> {
    const response = await apiClient.get<GlossaryListResponse>(
      `/api/v1/books/${bookId}/glossary`,
      { params: { page, size } }
    );
    return response.data;
  }

  async getGlossaryTerm(bookId: number, term: string): Promise<GlossaryTermResponse> {
    const encodedTerm = encodeURIComponent(term);
    const response = await apiClient.get<GlossaryTermResponse>(
      `/api/v1/books/${bookId}/glossary/${encodedTerm}`
    );
    return response.data;
  }

  async searchGlossary(
    query: string,
    limit: number = 5,
    bookId?: number
  ): Promise<GlossarySearchResponse> {
    const requestBody: GlossarySearchRequest = {
      query,
      limit,
      book_id: bookId || null,
    };
    const response = await apiClient.post<GlossarySearchResponse>(
      '/api/v1/glossary/search',
      requestBody
    );
    return response.data;
  }

  async getGlossaryEmbeddings(
    bookId: number,
    page: number = 1,
    size: number = 10
  ): Promise<GlossaryEmbeddingsResponse> {
    const response = await apiClient.get<GlossaryEmbeddingsResponse>(
      `/api/v1/books/${bookId}/glossary/embeddings`,
      { params: { page, size } }
    );
    return response.data;
  }

  async getEmbeddingsStats(): Promise<EmbeddingsStats> {
    const response = await apiClient.get<EmbeddingsStats>(
      '/api/v1/glossary/embeddings/stats'
    );
    return response.data;
  }

  // Page Maps
  async getCorePages(bookId: number): Promise<CorePagesResponse> {
    const response = await apiClient.get<CorePagesResponse>(
      `/api/v1/books/${bookId}/pages/core`
    );
    return response.data;
  }

  async getFullPageMap(bookId: number): Promise<FullPageMapResponse> {
    const response = await apiClient.get<FullPageMapResponse>(
      `/api/v1/books/${bookId}/pages`
    );
    return response.data;
  }

  // Table of Contents
  async getTableOfContents(bookId: number): Promise<TocResponse> {
    const response = await apiClient.get<TocResponse>(`/api/v1/books/${bookId}/toc`);
    return response.data;
  }

  async getPaginatedToc(
    bookId: number,
    page: number = 1,
    size: number = 50
  ): Promise<TocListResponse> {
    const response = await apiClient.get<TocListResponse>(
      `/api/v1/books/${bookId}/toc/paginated`,
      { params: { page, size } }
    );
    return response.data;
  }

  // Health
  async checkHealth(): Promise<HealthCheck> {
    const response = await apiClient.get<HealthCheck>('/health');
    return response.data;
  }
}

export default new PureBhaktiApiService();
```

### Usage in React Native Components

```typescript
// screens/BooksScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import pureBhaktiApi from '../services/pureBhaktiApi.service';
import { Book } from '../types/api.types';

export const BooksScreen = ({ navigation }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await pureBhaktiApi.getBooks(page, 20);
      setBooks(prev => [...prev, ...response.books]);
      setHasMore(page * 20 < response.total);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadBooks();
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}
      style={{ padding: 16, borderBottomWidth: 1 }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        {item.original_book_title}
      </Text>
      {item.english_book_title && (
        <Text style={{ fontSize: 14, color: '#666' }}>
          {item.english_book_title}
        </Text>
      )}
      <Text style={{ fontSize: 12, marginTop: 4 }}>
        {item.number_of_pages} pages • {item.original_author}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={item => item.book_id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ padding: 20 }} /> : null
        }
      />
    </View>
  );
};
```

---

## Pagination Strategy

### Infinite Scroll Implementation

```typescript
// hooks/useInfiniteScroll.ts
import { useState, useCallback } from 'react';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export const useInfiniteScroll = <T>(
  fetchFunction: (page: number, size: number) => Promise<PaginatedResponse<T>>,
  pageSize: number = 20
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetchFunction(page, pageSize);

      setData(prev => [...prev, ...response.data]);
      setHasMore(page * pageSize < response.total);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFunction, pageSize]);

  const refresh = useCallback(async () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);

    try {
      setLoading(true);
      const response = await fetchFunction(1, pageSize);
      setData(response.data);
      setHasMore(pageSize < response.total);
      setPage(2);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pageSize]);

  return { data, loading, hasMore, error, loadMore, refresh };
};

// Usage
const { data: books, loading, loadMore, refresh } = useInfiniteScroll(
  async (page, size) => {
    const response = await pureBhaktiApi.getBooks(page, size);
    return {
      data: response.books,
      total: response.total,
      page: response.page,
      size: response.size,
    };
  },
  20
);
```

### Load All Pages Strategy

```typescript
// utils/pagination.utils.ts

export const loadAllPages = async <T>(
  fetchFunction: (page: number, size: number) => Promise<{
    data: T[];
    total: number;
  }>,
  pageSize: number = 100
): Promise<T[]> => {
  const firstPage = await fetchFunction(1, pageSize);
  const allData = [...firstPage.data];

  const totalPages = Math.ceil(firstPage.total / pageSize);

  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(fetchFunction(page, pageSize));
    }

    const results = await Promise.all(pagePromises);
    results.forEach(result => allData.push(...result.data));
  }

  return allData;
};

// Usage - load all glossary terms for offline use
const loadAllGlossaryTerms = async (bookId: number) => {
  const allTerms = await loadAllPages(
    async (page, size) => {
      const response = await pureBhaktiApi.getBookGlossary(bookId, page, size);
      return {
        data: response.glossary_terms,
        total: response.total,
      };
    },
    100
  );

  // Store in local database or state
  return allTerms;
};
```

---

## Error Handling

### Comprehensive Error Handler

```typescript
// utils/error.utils.ts
import { AxiosError } from 'axios';
import { ApiError } from '../types/api.types';

export class ApiException extends Error {
  statusCode: number;
  detail: string;

  constructor(statusCode: number, detail: string) {
    super(detail);
    this.statusCode = statusCode;
    this.detail = detail;
    this.name = 'ApiException';
  }
}

export const handleApiError = (error: unknown): ApiException => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Server responded with error status
      const apiError = error.response.data as ApiError;
      return new ApiException(
        error.response.status,
        apiError.detail || 'An error occurred'
      );
    } else if (error.request) {
      // Request made but no response
      return new ApiException(0, 'No response from server. Check your connection.');
    }
  }

  // Unknown error
  return new ApiException(500, 'An unexpected error occurred');
};

// Usage in components
try {
  const book = await pureBhaktiApi.getBookById(bookId);
  setBook(book);
} catch (error) {
  const apiError = handleApiError(error);

  if (apiError.statusCode === 404) {
    Alert.alert('Not Found', 'Book not found');
  } else if (apiError.statusCode === 0) {
    Alert.alert('Network Error', apiError.detail);
  } else {
    Alert.alert('Error', apiError.detail);
  }
}
```

### Retry Logic for Network Issues

```typescript
// utils/retry.utils.ts

export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
};

// Usage
const getBookWithRetry = async (bookId: number) => {
  return retryWithExponentialBackoff(
    () => pureBhaktiApi.getBookById(bookId),
    3,
    1000
  );
};
```

---

## Best Practices for Mobile

### 1. Caching Strategy

```typescript
// utils/cache.utils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const cacheUtils = {
  async set<T>(key: string, data: T): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);

      // Check if cache is expired
      if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};

// Cached API service wrapper
export const getCachedBooks = async (): Promise<BookListResponse> => {
  const cacheKey = 'books_list_page_1';

  // Try cache first
  const cached = await cacheUtils.get<BookListResponse>(cacheKey);
  if (cached) {
    console.log('Returning cached books');
    return cached;
  }

  // Fetch from API
  const books = await pureBhaktiApi.getBooks(1, 50);
  await cacheUtils.set(cacheKey, books);

  return books;
};
```

### 2. Offline Support

```typescript
// hooks/useOfflineData.ts
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { cacheUtils } from '../utils/cache.utils';

export const useOfflineData = <T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    loadData();

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try cache first
      const cached = await cacheUtils.get<T>(cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
      }

      // Try network
      try {
        const fresh = await fetchFunction();
        setData(fresh);
        await cacheUtils.set(cacheKey, fresh);
      } catch (networkError) {
        if (!cached) {
          throw networkError;
        }
        // Use cached data if network fails
        console.log('Using cached data due to network error');
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, isOffline, error, refresh: loadData };
};

// Usage
const { data: book, loading, isOffline } = useOfflineData(
  `book_${bookId}`,
  () => pureBhaktiApi.getBookById(bookId)
);
```

### 3. Image Optimization (if serving images in future)

```typescript
// utils/image.utils.ts

export const getOptimizedImageUrl = (
  baseUrl: string,
  width: number,
  quality: number = 80
): string => {
  // Placeholder for future image optimization
  return `${baseUrl}?w=${width}&q=${quality}`;
};
```

### 4. Batch Requests for Performance

```typescript
// utils/batch.utils.ts

export const batchRequests = async <T>(
  items: any[],
  fetchFunction: (item: any) => Promise<T>,
  batchSize: number = 5
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => fetchFunction(item))
    );
    results.push(...batchResults);

    // Small delay between batches to avoid overwhelming the server
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
};

// Usage - load content for multiple pages
const loadMultiplePages = async (bookId: number, pageNumbers: number[]) => {
  return batchRequests(
    pageNumbers,
    (pageNum) => pureBhaktiApi.getPageContent(bookId, pageNum),
    3 // Process 3 pages at a time
  );
};
```

### 5. Request Cancellation

```typescript
// hooks/useCancellableRequest.ts
import { useEffect, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';

export const useCancellableRequest = () => {
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    return () => {
      // Cancel on unmount
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  const makeCancellableRequest = async <T>(
    requestFn: (cancelToken: any) => Promise<T>
  ): Promise<T> => {
    // Cancel previous request if exists
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('New request started');
    }

    // Create new cancel token
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      return await requestFn(cancelTokenRef.current.token);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled:', error.message);
      }
      throw error;
    }
  };

  return { makeCancellableRequest };
};

// Usage in search
const { makeCancellableRequest } = useCancellableRequest();

const handleSearch = async (query: string) => {
  try {
    const results = await makeCancellableRequest((cancelToken) =>
      apiClient.post('/api/v1/glossary/search',
        { query, limit: 10 },
        { cancelToken }
      )
    );
    setSearchResults(results.data);
  } catch (error) {
    // Handle error
  }
};
```

---

## Common Use Cases

### Use Case 1: Book Reader Flow

```typescript
// Complete flow for reading a book

// 1. List all books
const booksResponse = await pureBhaktiApi.getBooks(1, 20);
const selectedBook = booksResponse.books[0];

// 2. Get book details
const bookDetails = await pureBhaktiApi.getBookById(selectedBook.book_id);

// 3. Load table of contents for navigation
const toc = await pureBhaktiApi.getTableOfContents(selectedBook.book_id);

// 4. Get core pages (main content)
const corePages = await pureBhaktiApi.getCorePages(selectedBook.book_id);

// 5. Load first page content
const firstPage = corePages.pages[0].page_number;
const pageContent = await pureBhaktiApi.getPageContent(
  selectedBook.book_id,
  firstPage
);

// 6. Display content
console.log(pageContent.content?.ai_page_content);
```

### Use Case 2: Glossary Lookup While Reading

```typescript
// User taps on a term while reading

const handleTermTap = async (term: string, bookId: number) => {
  try {
    // Try exact match first
    const termResponse = await pureBhaktiApi.getGlossaryTerm(bookId, term);

    if (termResponse.term) {
      // Show definition modal
      showDefinitionModal(termResponse.term);
    } else {
      // Term not found, try semantic search
      const searchResults = await pureBhaktiApi.searchGlossary(term, 5, bookId);

      if (searchResults.results.length > 0) {
        // Show search results to user
        showSearchResultsModal(searchResults.results);
      } else {
        showAlert('Term not found in glossary');
      }
    }
  } catch (error) {
    handleApiError(error);
  }
};
```

### Use Case 3: Offline Book Download

```typescript
// Download book for offline reading

const downloadBookForOffline = async (bookId: number) => {
  try {
    // 1. Get book details
    const book = await pureBhaktiApi.getBookById(bookId);
    await cacheUtils.set(`book_${bookId}`, book);

    // 2. Download TOC
    const toc = await pureBhaktiApi.getTableOfContents(bookId);
    await cacheUtils.set(`toc_${bookId}`, toc);

    // 3. Download all content (in batches)
    const totalPages = book.number_of_pages;
    const batchSize = 50;

    for (let page = 1; page <= totalPages; page += batchSize) {
      const contentResponse = await pureBhaktiApi.getBookContent(
        bookId,
        Math.ceil(page / batchSize),
        batchSize
      );

      // Cache each page
      for (const content of contentResponse.content) {
        await cacheUtils.set(
          `content_${bookId}_${content.page_number}`,
          content
        );
      }

      // Update progress
      const progress = Math.min(100, (page / totalPages) * 100);
      updateDownloadProgress(progress);
    }

    // 4. Download glossary
    const glossary = await loadAllPages(
      (page, size) => pureBhaktiApi.getBookGlossary(bookId, page, size),
      100
    );
    await cacheUtils.set(`glossary_${bookId}`, glossary);

    showAlert('Book downloaded successfully!');
  } catch (error) {
    showAlert('Download failed. Please try again.');
  }
};
```

### Use Case 4: Smart Search Across All Books

```typescript
// Global search functionality

const globalSearch = async (searchQuery: string) => {
  try {
    // Use semantic search for intelligent results
    const results = await pureBhaktiApi.searchGlossary(searchQuery, 20);

    // Group results by book
    const resultsByBook = results.results.reduce((acc, result) => {
      if (!acc[result.book_id]) {
        acc[result.book_id] = {
          book_name: result.book_name,
          terms: [],
        };
      }
      acc[result.book_id].terms.push(result);
      return acc;
    }, {} as Record<number, { book_name: string; terms: GlossarySearchResult[] }>);

    return resultsByBook;
  } catch (error) {
    handleApiError(error);
    return {};
  }
};

// Usage
const results = await globalSearch('devotion');
// Returns terms grouped by book for better UX
```

### Use Case 5: Preload Adjacent Pages

```typescript
// Improve reading experience by preloading next/previous pages

const preloadAdjacentPages = async (
  bookId: number,
  currentPage: number,
  corePages: CorePageInfo[]
) => {
  const currentIndex = corePages.findIndex(p => p.page_number === currentPage);

  if (currentIndex === -1) return;

  // Get adjacent page numbers
  const pagesToPreload: number[] = [];

  if (currentIndex > 0) {
    pagesToPreload.push(corePages[currentIndex - 1].page_number);
  }
  if (currentIndex < corePages.length - 1) {
    pagesToPreload.push(corePages[currentIndex + 1].page_number);
  }

  // Preload in background
  pagesToPreload.forEach(async (pageNum) => {
    try {
      const content = await pureBhaktiApi.getPageContent(bookId, pageNum);
      await cacheUtils.set(`content_${bookId}_${pageNum}`, content);
    } catch (error) {
      // Silent fail for preloading
      console.log(`Failed to preload page ${pageNum}`);
    }
  });
};
```

---

## Performance Optimization Tips

### 1. Initial App Load
```typescript
// Load essential data on app start
const initializeApp = async () => {
  try {
    // Check API health
    const health = await pureBhaktiApi.checkHealth();

    if (health.status === 'healthy') {
      // Load books list (first page only)
      const books = await getCachedBooks();

      // Get embedding stats to show which books support semantic search
      const stats = await pureBhaktiApi.getEmbeddingsStats();

      return { books, stats };
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
};
```

### 2. Lazy Loading for Large Content
```typescript
// Only load content when user scrolls to it
const LazyBookContent = ({ bookId, pageNumber }) => {
  const [content, setContent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible && !content) {
      loadContent();
    }
  }, [visible]);

  const loadContent = async () => {
    const data = await pureBhaktiApi.getPageContent(bookId, pageNumber);
    setContent(data.content);
  };

  return (
    <ViewabilityTracker onVisibilityChange={setVisible}>
      {content ? <ContentRenderer content={content} /> : <Skeleton />}
    </ViewabilityTracker>
  );
};
```

### 3. Debounced Search
```typescript
// Debounce search requests to reduce API calls
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query: string) => {
  if (query.length < 2) return;

  const results = await pureBhaktiApi.searchGlossary(query, 10);
  setSearchResults(results.results);
}, 500);

// Usage in search input
<TextInput
  onChangeText={(text) => {
    setQuery(text);
    debouncedSearch(text);
  }}
  placeholder="Search glossary..."
/>
```

---

## API Rate Limiting & Throttling

While the API doesn't explicitly enforce rate limits, follow these guidelines:

- **Max concurrent requests**: Keep to 5 or fewer simultaneous requests
- **Batch downloads**: Add 100-200ms delay between batch requests
- **Search queries**: Debounce user input by at least 500ms
- **Page size limits**: Respect maximum page sizes (100 for most endpoints, 200 for TOC)

---

## Additional Resources

- **Swagger UI**: https://purebhaktibase.com:8443/docs
- **OpenAPI Spec**: https://purebhaktibase.com:8443/openapi.json
- **ReDoc**: https://purebhaktibase.com:8443/redoc

---

## Support

For questions or issues with the API, please contact the Pure Bhakti Vault development team or create an issue in the project repository.

---

**Last Updated**: 2026-01-08
**API Version**: 1.0.0
**Documentation Version**: 1.0.0
