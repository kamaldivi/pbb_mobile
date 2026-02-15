import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BookmarksScreenProps } from '@/types/navigation';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { NavigationDrawer } from '@/components/NavigationDrawer';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';

const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ navigation }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { bookmarks, removeBookmark } = useBookmarkStore();

  // Group bookmarks by book
  const bookmarksByBook = bookmarks.reduce((acc, bookmark) => {
    const bookTitle = bookmark.bookTitle || 'Unknown Book';
    if (!acc[bookTitle]) {
      acc[bookTitle] = [];
    }
    acc[bookTitle].push(bookmark);
    return acc;
  }, {} as Record<string, typeof bookmarks>);

  const handleBookmarkPress = (bookId: number, pageNumber: number) => {
    navigation.navigate('Reader', { bookId, page: pageNumber });
  };

  const handleDeleteBookmark = (bookmarkId: string, customName?: string) => {
    Alert.alert(
      'Delete Bookmark',
      `Are you sure you want to delete ${customName ? `"${customName}"` : 'this bookmark'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeBookmark(bookmarkId),
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setDrawerVisible(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Bookmarks</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
          <Text style={styles.emptyText}>
            Bookmarks you create while reading will appear here
          </Text>
          <TouchableOpacity
            style={styles.goToLibraryButton}
            onPress={() => navigation.navigate('Library')}
          >
            <Ionicons name="library" size={20} color={colors.text.inverse} />
            <Text style={styles.goToLibraryText}>Go to Library</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {Object.entries(bookmarksByBook).map(([bookTitle, bookBookmarks]) => (
            <View key={bookTitle} style={styles.bookSection}>
              {/* Book Title Header */}
              <View style={styles.bookHeader}>
                <Ionicons name="book" size={20} color={colors.primary} />
                <Text style={styles.bookTitle}>{bookTitle}</Text>
                <Text style={styles.bookmarkCount}>
                  {bookBookmarks.length} {bookBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                </Text>
              </View>

              {/* Bookmarks for this book */}
              {bookBookmarks
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((bookmark) => (
                  <TouchableOpacity
                    key={bookmark.id}
                    style={styles.bookmarkItem}
                    onPress={() => handleBookmarkPress(bookmark.bookId, bookmark.pageNumber)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bookmarkContent}>
                      <View style={styles.bookmarkHeader}>
                        <Ionicons
                          name="bookmark"
                          size={20}
                          color={colors.primary}
                          style={styles.bookmarkIcon}
                        />
                        <View style={styles.bookmarkInfo}>
                          <Text style={styles.bookmarkName}>
                            {bookmark.customName || `Page ${bookmark.pageNumber}`}
                          </Text>
                          <Text style={styles.bookmarkMeta}>
                            Page {bookmark.pageNumber} • {formatDate(bookmark.createdAt)}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteBookmark(bookmark.id, bookmark.customName)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Navigation Drawer */}
      <NavigationDrawer
        visible={drawerVisible}
        currentRoute="Bookmarks"
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
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...shadows.sm,
  },
  menuButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  goToLibraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  goToLibraryText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  bookSection: {
    marginBottom: spacing.xl,
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  bookTitle: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  bookmarkCount: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  bookmarkItem: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookmarkIcon: {
    marginRight: spacing.sm,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  bookmarkMeta: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
});

export default BookmarksScreen;
