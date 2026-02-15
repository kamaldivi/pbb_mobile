import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReaderScreenProps } from '@/types/navigation';
import { useBook, useBookTOC, useBookCorePages } from '@/services/api/hooks';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useOfflineStore } from '@/stores/offlineStore';
import { offlineManager } from '@/services/offline/OfflineManager';
// Use simple PageViewer for Expo Go (worklets version mismatch)
// Production builds will work fine with PageViewer (full gestures)
import { PageViewer } from '@/components/reader/PageViewer.simple';
import { ReaderControls } from '@/components/reader/ReaderControls';
import { BookmarkModal } from '@/components/reader/BookmarkModal';
import { TableOfContents } from '@/components/reader/TableOfContents';
import { GoToPageModal } from '@/components/reader/GoToPageModal';
import { colors } from '@/theme';
import type { DownloadedBook } from '@/types/offline';

const ReaderScreen: React.FC<ReaderScreenProps> = ({ route, navigation }) => {
  const { bookId, page: initialPage } = route.params;
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [bookmarkModalVisible, setBookmarkModalVisible] = useState(false);
  const [tocVisible, setTocVisible] = useState(false);
  const [goToPageVisible, setGoToPageVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [offlineBook, setOfflineBook] = useState<DownloadedBook | null>(null);

  const { isBookDownloaded, getDownloadedBook, isOnline } = useOfflineStore();
  const isDownloaded = isBookDownloaded(bookId);

  // Fetch book data (only when online or not downloaded)
  const { data: book, isLoading } = useBook(bookId, { enabled: isOnline || !isDownloaded });

  // Fetch table of contents (only when online or not downloaded)
  const { data: tocData, isLoading: isTocLoading } = useBookTOC(bookId, { enabled: isOnline || !isDownloaded });

  // Fetch page maps to get page labels (only when online or not downloaded)
  const { data: corePagesData } = useBookCorePages(bookId, { enabled: isOnline || !isDownloaded });

  // Load offline book data if available
  useEffect(() => {
    if (isDownloaded) {
      const loadOfflineBook = async () => {
        const downloaded = getDownloadedBook(bookId);
        if (downloaded) {
          setOfflineBook(downloaded);
          // Update last read timestamp
          await offlineManager.updateLastRead(bookId);
        }
      };
      loadOfflineBook();
    }
  }, [bookId, isDownloaded, getDownloadedBook]);

  // Use offline data when available, otherwise use API data
  const totalPages = offlineBook?.metadata.totalPages || book?.number_of_pages || 1;
  const bookTitle = offlineBook?.metadata.title || book?.original_book_title || 'Unknown Book';
  const toc = offlineBook?.toc || tocData?.table_of_contents || [];
  const corePages = offlineBook?.corePages || corePagesData?.pages || [];
  const currentPageLabel = corePages.find(
    (p) => p.page_number === currentPage
  )?.page_label || null;

  // Bookmark store
  const {
    isPageBookmarked,
    getBookmarkForPage,
    addBookmark,
    removeBookmark,
    updateBookmark,
  } = useBookmarkStore();

  const isBookmarked = isPageBookmarked(bookId, currentPage);
  const existingBookmark = getBookmarkForPage(bookId, currentPage);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!controlsVisible) return;

    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [controlsVisible, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setControlsVisible(true);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setControlsVisible(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setControlsVisible(true);
  };

  const handleSwipeLeft = () => {
    handleNextPage();
  };

  const handleSwipeRight = () => {
    handlePreviousPage();
  };

  const handleToggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleToggleBookmark = () => {
    setBookmarkModalVisible(true);
    setControlsVisible(true);
  };

  const handleSaveBookmark = (customName: string) => {
    if (existingBookmark) {
      // Update existing bookmark
      updateBookmark(existingBookmark.id, {
        customName: customName || undefined,
      });
    } else {
      // Create new bookmark
      addBookmark({
        bookId,
        bookTitle,
        pageNumber: currentPage,
        customName: customName || undefined,
      });
    }
  };

  const handleDeleteBookmark = () => {
    if (existingBookmark) {
      removeBookmark(existingBookmark.id);
    }
  };

  const handleOpenTOC = () => {
    setTocVisible(true);
    setControlsVisible(true);
  };

  const handleTOCNavigate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleShare = async () => {
    try {
      // Generate deep link URL
      const deepLink = `purebhaktibase://reader/${bookId}/${currentPage}`;
      const webLink = `https://purebhaktibase.com/reader/${bookId}/${currentPage}`;

      const message = `Check out page ${currentPage} of "${bookTitle}" on Pure Bhakti Base!\n\n${webLink}`;

      const result = await Share.share({
        message,
        url: deepLink, // iOS will use this
        title: `${bookTitle} - Page ${currentPage}`,
      });

      if (result.action === Share.sharedAction) {
        // Successfully shared
        setControlsVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share this page. Please try again.');
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setControlsVisible(true);
  };

  // Show loading only if we're online and loading, or if offline book isn't loaded yet
  if ((isOnline && isLoading && !book) || (isDownloaded && !offlineBook)) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        hidden={isFullscreen}
        animated
      />

      {/* Page Viewer with gesture handling */}
      <PageViewer
        bookId={bookId}
        pageNumber={currentPage}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        isOffline={isDownloaded}
      />

      {/* Reader Controls (top/bottom bars) */}
      {controlsVisible && (
        <ReaderControls
          currentPage={currentPage}
          totalPages={totalPages}
          currentPageLabel={currentPageLabel}
          isBookmarked={isBookmarked}
          isFullscreen={isFullscreen}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          onPageChange={handlePageChange}
          onToggleBookmark={handleToggleBookmark}
          onOpenTOC={handleOpenTOC}
          onOpenGoToPage={() => setGoToPageVisible(true)}
          onShare={handleShare}
          onToggleFullscreen={handleToggleFullscreen}
          onClose={handleClose}
        />
      )}

      {/* Bookmark Modal */}
      <BookmarkModal
        visible={bookmarkModalVisible}
        bookTitle={bookTitle}
        pageNumber={currentPage}
        existingName={existingBookmark?.customName}
        onSave={handleSaveBookmark}
        onDelete={isBookmarked ? handleDeleteBookmark : undefined}
        onClose={() => setBookmarkModalVisible(false)}
      />

      {/* Go to Page Modal */}
      <GoToPageModal
        visible={goToPageVisible}
        currentPage={currentPage}
        currentPageLabel={currentPageLabel}
        totalPages={totalPages}
        pagesList={corePages}
        onNavigate={handlePageChange}
        onClose={() => setGoToPageVisible(false)}
      />

      {/* Table of Contents */}
      <TableOfContents
        visible={tocVisible}
        bookTitle={bookTitle}
        tocItems={toc}
        currentPage={currentPage}
        isLoading={isTocLoading && !isDownloaded}
        onNavigate={handleTOCNavigate}
        onClose={() => setTocVisible(false)}
      />

      {/* Tap anywhere to toggle controls visibility */}
      {!controlsVisible && (
        <View style={styles.tapArea} onTouchEnd={handleToggleControls} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ReaderScreen;
