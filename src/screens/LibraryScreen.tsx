import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { LibraryScreenProps } from '@/types/navigation';
import { useBooks } from '@/services/api/hooks';
import { useLibraryStore } from '@/stores/libraryStore';
import { useOfflineStore } from '@/stores/offlineStore';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { offlineManager } from '@/services/offline/OfflineManager';
import { categorizeBooks, subgroupBooks } from '@/utils/bookCategories';
import { CategoryTabs } from '@/components/library/CategoryTabs';
import { SearchBar } from '@/components/library/SearchBar';
import { BookGrid } from '@/components/library/BookGrid';
import { SubgroupedBookList } from '@/components/library/SubgroupedBookList';
import { BookDetailsModal } from '@/components/library/BookDetailsModal';
import { NavigationDrawer } from '@/components/NavigationDrawer';
import type { Book } from '@/types/api';
import { colors, spacing, typography, borderRadius } from '@/theme';

const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { data: books, isLoading, error } = useBooks();
  const {
    activeTab,
    searchTerm,
    selectedBook,
    isDetailsModalOpen,
    setActiveTab,
    setSearchTerm,
    openBookDetails,
    closeBookDetails
  } = useLibraryStore();
  const { refreshDownloadedBooks, downloadedBooks } = useOfflineStore();
  const isOnline = useNetworkStatus();

  // Initialize offline manager and refresh downloaded books
  useEffect(() => {
    const initialize = async () => {
      await offlineManager.initialize();
      await refreshDownloadedBooks();
    };
    initialize();
  }, [refreshDownloadedBooks]);

  // Categorize books by type
  const categorizedBooks = useMemo(() => {
    if (!books) return { english: [], tamil: [], rays: [] };
    return categorizeBooks(books);
  }, [books]);

  // Get books for active tab
  const tabBooks = categorizedBooks[activeTab];

  // Create subgroups for English and Tamil (Gurudev vs Gokul Bhajan)
  const subgroups = useMemo(() => {
    if (activeTab === 'rays') return null;
    return subgroupBooks(tabBooks);
  }, [tabBooks, activeTab]);

  // Filter books by search term
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return tabBooks;

    const term = searchTerm.toLowerCase();
    return tabBooks.filter((book) => {
      const title = (book.original_book_title || '').toLowerCase();
      const englishTitle = (book.english_book_title || '').toLowerCase();
      const author = (book.original_author || '').toLowerCase();

      return (
        title.includes(term) ||
        englishTitle.includes(term) ||
        author.includes(term)
      );
    });
  }, [tabBooks, searchTerm]);

  // Filter subgroups by search term
  const filteredSubgroups = useMemo(() => {
    if (!subgroups || searchTerm.trim()) return null;
    return subgroups;
  }, [subgroups, searchTerm]);

  // Get counts for each category
  const counts = useMemo(() => ({
    english: categorizedBooks.english.length,
    tamil: categorizedBooks.tamil.length,
    rays: categorizedBooks.rays.length,
  }), [categorizedBooks]);

  const handleBookPress = (book: Book) => {
    navigation.navigate('Reader', { bookId: book.book_id });
  };

  const handleReadBook = () => {
    if (selectedBook) {
      closeBookDetails();
      navigation.navigate('Reader', { bookId: selectedBook.book_id });
    }
  };

  const handleViewDownloads = () => {
    navigation.navigate('Downloads');
  };

  // When offline and API fails, show downloaded books instead
  if (error && !isOnline) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setDrawerVisible(true)}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Library</Text>
          <View style={styles.networkStatus}>
            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline" size={16} color={colors.text.inverse} />
              <Text style={styles.offlineText}>Offline</Text>
            </View>
          </View>
        </View>

        {/* Offline Message */}
        <View style={styles.offlineContainer}>
          <Ionicons name="cloud-offline-outline" size={80} color={colors.text.tertiary} />
          <Text style={styles.offlineTitle}>You're Offline</Text>
          <Text style={styles.offlineMessage}>
            The full library catalog is not available while offline.
          </Text>

          {downloadedBooks.length > 0 ? (
            <>
              <Text style={styles.offlineSubMessage}>
                You have {downloadedBooks.length} book{downloadedBooks.length !== 1 ? 's' : ''} downloaded for offline reading.
              </Text>
              <TouchableOpacity
                style={styles.viewDownloadsButton}
                onPress={handleViewDownloads}
              >
                <Ionicons name="download" size={20} color={colors.text.inverse} />
                <Text style={styles.viewDownloadsButtonText}>View Downloaded Books</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.offlineSubMessage}>
              Download books while online to read them offline later.
            </Text>
          )}
        </View>

        {/* Navigation Drawer */}
        <NavigationDrawer
          visible={drawerVisible}
          currentRoute="Library"
          onClose={() => setDrawerVisible(false)}
        />
      </SafeAreaView>
    );
  }

  // When online but API fails
  if (error && isOnline) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setDrawerVisible(true)}
            style={styles.menuButton}
          >
            <Ionicons name="menu" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Library</Text>
          <View style={styles.networkStatus} />
        </View>

        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={80} color={colors.error} />
          <Text style={styles.errorText}>Failed to Load Library</Text>
          <Text style={styles.errorSubtext}>
            Unable to connect to the server. Please try again later.
          </Text>
        </View>

        {/* Navigation Drawer */}
        <NavigationDrawer
          visible={drawerVisible}
          currentRoute="Library"
          onClose={() => setDrawerVisible(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setDrawerVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Library</Text>
        <View style={styles.networkStatus}>
          {!isOnline && (
            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline" size={16} color={colors.text.inverse} />
              <Text style={styles.offlineText}>Offline</Text>
            </View>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <CategoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder={`Search ${activeTab} titles...`}
      />

      {/* Book List - Use subgroups for English/Tamil when not searching, regular grid otherwise */}
      {filteredSubgroups ? (
        <SubgroupedBookList
          key={`subgroup-${activeTab}`}
          gurudevBooks={filteredSubgroups.gurudev}
          gokulBhajanBooks={filteredSubgroups.gokulBhajan}
          onBookPress={handleBookPress}
          onViewDetails={openBookDetails}
          isLoading={isLoading}
        />
      ) : (
        <BookGrid
          key={`grid-${activeTab}-${searchTerm}`}
          books={filteredBooks}
          onBookPress={handleBookPress}
          onViewDetails={openBookDetails}
          isLoading={isLoading}
          emptyMessage={
            searchTerm.trim()
              ? `No books found for "${searchTerm}"`
              : 'No books in this category'
          }
        />
      )}

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        visible={isDetailsModalOpen}
        onClose={closeBookDetails}
        onReadBook={handleReadBook}
      />

      {/* Navigation Drawer */}
      <NavigationDrawer
        visible={drawerVisible}
        currentRoute="Library"
        onClose={() => setDrawerVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  menuButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  networkStatus: {
    width: 44,
    alignItems: 'flex-end',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  offlineText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  errorSubtext: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  offlineTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  offlineMessage: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  offlineSubMessage: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  viewDownloadsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 200,
  },
  viewDownloadsButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
  },
});

export default LibraryScreen;
