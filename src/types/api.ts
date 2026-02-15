// Book Types
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
  toc_pages: string | null;
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

// Table of Contents Types
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

// Page Map Types
export interface PageMap {
  page_map_id: number;
  book_id: number;
  page_number: number;
  page_label: string | null;
  page_type: string;
  page_header: string | null;
  created_at: string | null;
}

export interface FullPageMapResponse {
  page_maps: PageMap[];
  total: number;
  page: number;
  size: number;
  book_id: number;
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

// API Error
export interface ApiError {
  detail: string;
}

// Health Check
export interface HealthCheck {
  status: string;
  service: string;
}
