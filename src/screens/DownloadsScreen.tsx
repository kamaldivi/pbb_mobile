import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';
import { useOfflineStore } from '@/stores/offlineStore';
import { offlineManager } from '@/services/offline/OfflineManager';
import { orphanDetector } from '@/services/offline/OrphanDetector';
import { orphanDismissalManager } from '@/services/offline/OrphanDismissalManager';
import { IMAGE_CONFIG } from '@/config/api.config';
import { NavigationDrawer } from '@/components/NavigationDrawer';
import type { DownloadedBook } from '@/types/offline';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const DownloadsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { downloadedBooks, refreshDownloadedBooks, deleteBook } = useOfflineStore();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);
  const [availableSpace, setAvailableSpace] = useState(0);
  const [isCheckingOrphans, setIsCheckingOrphans] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Check for orphaned books when screen is focused
  useEffect(() => {
    checkForOrphans();
  }, [downloadedBooks.length]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await refreshDownloadedBooks();
      const [size, space] = await Promise.all([
        offlineManager.getTotalDownloadedSize(),
        offlineManager.getAvailableSpace(),
      ]);
      setTotalSize(size);
      setAvailableSpace(space);
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        // User dismissed recently or dismissed 3+ times
        return;
      }

      // Get dismiss count for messaging
      const dismissCount = await orphanDismissalManager.getDismissCount();

      // Show alert
      Alert.alert(
        'Downloaded Books Update',
        `${orphans.length} downloaded book${orphans.length > 1 ? 's have' : ' has'} been updated to newer versions on the server. The old version${orphans.length > 1 ? 's are' : ' is'} no longer available.\n\nWould you like to remove ${orphans.length > 1 ? 'them' : 'it'} to free up storage space?${dismissCount >= 2 ? '\n\nNote: You can download the latest versions from the Library.' : ''}`,
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
              await loadData();

              // Show success message
              Alert.alert(
                'Cleanup Complete',
                `${orphans.length} old book version${orphans.length > 1 ? 's' : ''} removed. You can download the latest version${orphans.length > 1 ? 's' : ''} from the Library.`
              );
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error checking for orphans:', error);
    } finally {
      setIsCheckingOrphans(false);
    }
  };

  const handleDeleteBook = (book: DownloadedBook) => {
    Alert.alert(
      'Delete Downloaded Book',
      `Remove "${book.metadata.title}" from your device? You can download it again anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(book.bookId);
              await loadData();
              Alert.alert('Success', 'Book deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    if (downloadedBooks.length === 0) return;

    Alert.alert(
      'Delete All Downloads',
      `Remove all ${downloadedBooks.length} downloaded books from your device? This will free up ${formatBytes(totalSize)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                downloadedBooks.map((book) => deleteBook(book.bookId))
              );
              await loadData();
              Alert.alert('Success', 'All books deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete all books');
            }
          },
        },
      ]
    );
  };

  const handleReadBook = (book: DownloadedBook) => {
    navigation.navigate('Reader', { bookId: book.bookId });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading downloads...</Text>
        </View>
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
        <Text style={styles.headerTitle}>Downloads</Text>
        <View style={styles.headerActions}>
          {downloadedBooks.length > 0 && (
            <TouchableOpacity onPress={handleDeleteAll} style={styles.deleteAllButton}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={styles.deleteAllText}>Delete All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Storage Summary */}
      <View style={styles.storageCard}>
        <View style={styles.storageStat}>
          <Ionicons name="download-outline" size={24} color={colors.primary} />
          <View style={styles.storageStatText}>
            <Text style={styles.storageStatLabel}>Downloaded</Text>
            <Text style={styles.storageStatValue}>
              {downloadedBooks.length} {downloadedBooks.length === 1 ? 'book' : 'books'}
            </Text>
          </View>
        </View>

        <View style={styles.storageStat}>
          <Ionicons name="archive-outline" size={24} color={colors.primary} />
          <View style={styles.storageStatText}>
            <Text style={styles.storageStatLabel}>Storage Used</Text>
            <Text style={styles.storageStatValue}>{formatBytes(totalSize)}</Text>
          </View>
        </View>

        <View style={styles.storageStat}>
          <Ionicons name="server-outline" size={24} color={colors.success} />
          <View style={styles.storageStatText}>
            <Text style={styles.storageStatLabel}>Available Space</Text>
            <Text style={styles.storageStatValue}>{formatBytes(availableSpace)}</Text>
          </View>
        </View>
      </View>

      {/* Books List */}
      {downloadedBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-download-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Downloaded Books</Text>
          <Text style={styles.emptyText}>
            Download books from the library for offline reading
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.booksList}
          contentContainerStyle={styles.booksListContent}
          showsVerticalScrollIndicator={false}
        >
          {downloadedBooks
            .sort((a, b) => {
              const dateA = a.metadata.lastReadAt || a.metadata.downloadedAt;
              const dateB = b.metadata.lastReadAt || b.metadata.downloadedAt;
              return new Date(dateB).getTime() - new Date(dateA).getTime();
            })
            .map((book) => (
              <TouchableOpacity
                key={book.bookId}
                style={styles.bookCard}
                onPress={() => handleReadBook(book)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: IMAGE_CONFIG.getBookThumbnail(book.bookId) }}
                  style={styles.bookImage}
                  contentFit="cover"
                  transition={200}
                />

                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {book.metadata.title}
                  </Text>

                  {book.metadata.originalTitle &&
                   book.metadata.originalTitle !== book.metadata.title && (
                    <Text style={styles.bookSubtitle} numberOfLines={1}>
                      {book.metadata.originalTitle}
                    </Text>
                  )}

                  <Text style={styles.bookAuthor} numberOfLines={1}>
                    {book.metadata.author}
                  </Text>

                  <View style={styles.bookMetadata}>
                    <View style={styles.metadataItem}>
                      <Ionicons name="document-text-outline" size={14} color={colors.text.secondary} />
                      <Text style={styles.metadataText}>{book.metadata.totalPages} pages</Text>
                    </View>

                    <View style={styles.metadataItem}>
                      <Ionicons name="save-outline" size={14} color={colors.text.secondary} />
                      <Text style={styles.metadataText}>{formatBytes(book.metadata.size)}</Text>
                    </View>
                  </View>

                  <View style={styles.bookFooter}>
                    <Text style={styles.downloadDate}>
                      {book.metadata.lastReadAt
                        ? `Read ${formatDate(book.metadata.lastReadAt)}`
                        : `Downloaded ${formatDate(book.metadata.downloadedAt)}`
                      }
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDeleteBook(book)}
                  style={styles.deleteButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}

      {/* Navigation Drawer */}
      <NavigationDrawer
        visible={drawerVisible}
        currentRoute="Downloads"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  headerActions: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  deleteAllText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
  storageCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  storageStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  storageStatText: {
    flex: 1,
  },
  storageStatLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  storageStatValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  booksList: {
    flex: 1,
  },
  booksListContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  bookImage: {
    width: 70,
    height: 95,
    borderRadius: borderRadius.md,
  },
  bookInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  bookTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  bookSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  bookAuthor: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  bookMetadata: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metadataText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  bookFooter: {
    marginTop: 'auto',
  },
  downloadDate: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
  },
  deleteButton: {
    padding: spacing.sm,
    justifyContent: 'flex-start',
  },
});
