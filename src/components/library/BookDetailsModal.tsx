import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Book } from '@/types/api';
import { IMAGE_CONFIG } from '@/config/api.config';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';
import { useOfflineStore } from '@/stores/offlineStore';
import { offlineManager } from '@/services/offline/OfflineManager';
import type { DownloadProgress } from '@/types/offline';

interface BookDetailsModalProps {
  book: Book | null;
  visible: boolean;
  onClose: () => void;
  onReadBook: () => void;
}

const { width, height } = Dimensions.get('window');

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
};

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  visible,
  onClose,
  onReadBook,
}) => {
  const {  isBookDownloaded,
    getDownloadedBook,
    deleteBook,
    updateDownloadProgress,
  } = useOfflineStore();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);

  const isDownloaded = book ? isBookDownloaded(book.book_id) : false;
  const downloadedBook = book ? getDownloadedBook(book.book_id) : undefined;

  useEffect(() => {
    if (book && visible) {
      // Estimate download size
      offlineManager.estimateBookSize(book).then(setEstimatedSize);
    }
  }, [book, visible]);

  const handleDownload = async () => {
    if (!book) return;

    try {
      // Check available space
      const availableSpace = await offlineManager.getAvailableSpace();

      if (estimatedSize > availableSpace) {
        Alert.alert(
          'Insufficient Storage',
          `This book requires ${formatBytes(estimatedSize)} but you only have ${formatBytes(availableSpace)} available. Please free up space and try again.`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Confirm download
      Alert.alert(
        'Download Book',
        `Download "${book.original_book_title || book.english_book_title}" for offline reading?\n\nSize: ${formatBytes(estimatedSize)}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              setIsDownloading(true);
              setDownloadProgress({
                bookId: book.book_id,
                downloadedPages: 0,
                totalPages: book.number_of_pages,
                downloadedBytes: 0,
                totalBytes: estimatedSize,
                status: 'downloading',
              });

              try {
                await offlineManager.downloadBook(book, (progress) => {
                  setDownloadProgress(progress);
                  updateDownloadProgress(book.book_id, progress);
                });

                Alert.alert('Success', 'Book downloaded successfully!');
              } catch (error) {
                Alert.alert(
                  'Download Failed',
                  error instanceof Error ? error.message : 'Failed to download book'
                );
              } finally {
                setIsDownloading(false);
                setDownloadProgress(null);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate download');
    }
  };

  const handleDelete = () => {
    if (!book) return;

    Alert.alert(
      'Delete Downloaded Book',
      `Remove "${book.original_book_title || book.english_book_title}" from your device? You can download it again anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(book.book_id);
              Alert.alert('Success', 'Book deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  if (!book) return null;

  const thumbnailUrl = IMAGE_CONFIG.getBookThumbnail(book.book_id);
  const title = book.original_book_title || book.english_book_title || 'Untitled';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Book Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: thumbnailUrl }}
                style={styles.image}
                contentFit="contain"
                transition={200}
              />
            </View>

            <Text style={styles.title}>{title}</Text>

            {book.english_book_title && book.english_book_title !== book.original_book_title && (
              <Text style={styles.subtitle}>{book.english_book_title}</Text>
            )}

            {/* Download Status */}
            {isDownloaded && downloadedBook && (
              <View style={styles.downloadedBanner}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.downloadedText}>Available Offline</Text>
              </View>
            )}

            {/* Download Progress */}
            {isDownloading && downloadProgress && (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Downloading...</Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round((downloadProgress.downloadedPages / downloadProgress.totalPages) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${(downloadProgress.downloadedPages / downloadProgress.totalPages) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {downloadProgress.downloadedPages} of {downloadProgress.totalPages} pages
                  {' • '}
                  {formatBytes(downloadProgress.downloadedBytes)} of {formatBytes(downloadProgress.totalBytes)}
                </Text>
              </View>
            )}

            {/* Metadata */}
            <View style={styles.metadata}>
              {book.original_author && (
                <View style={styles.metadataRow}>
                  <Ionicons name="person-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.metadataLabel}>Author:</Text>
                  <Text style={styles.metadataValue}>{book.original_author}</Text>
                </View>
              )}

              {book.commentary_author && (
                <View style={styles.metadataRow}>
                  <Ionicons name="create-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.metadataLabel}>Commentary:</Text>
                  <Text style={styles.metadataValue}>{book.commentary_author}</Text>
                </View>
              )}

              <View style={styles.metadataRow}>
                <Ionicons name="document-text-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.metadataLabel}>Pages:</Text>
                <Text style={styles.metadataValue}>{book.number_of_pages}</Text>
              </View>

              {book.edition && (
                <View style={styles.metadataRow}>
                  <Ionicons name="bookmark-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.metadataLabel}>Edition:</Text>
                  <Text style={styles.metadataValue}>{book.edition}</Text>
                </View>
              )}

              {/* Download Size */}
              {!isDownloaded && estimatedSize > 0 && (
                <View style={styles.metadataRow}>
                  <Ionicons name="cloud-download-outline" size={16} color={colors.text.secondary} />
                  <Text style={styles.metadataLabel}>Download Size:</Text>
                  <Text style={styles.metadataValue}>{formatBytes(estimatedSize)}</Text>
                </View>
              )}

              {/* Downloaded Info */}
              {isDownloaded && downloadedBook && (
                <>
                  <View style={styles.metadataRow}>
                    <Ionicons name="save-outline" size={16} color={colors.text.secondary} />
                    <Text style={styles.metadataLabel}>Size:</Text>
                    <Text style={styles.metadataValue}>{formatBytes(downloadedBook.metadata.size)}</Text>
                  </View>
                  <View style={styles.metadataRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
                    <Text style={styles.metadataLabel}>Downloaded:</Text>
                    <Text style={styles.metadataValue}>
                      {new Date(downloadedBook.metadata.downloadedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Summary */}
            {book.book_summary && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryLabel}>About this book</Text>
                <Text style={styles.summaryText}>{book.book_summary}</Text>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            {isDownloading ? (
              <View style={styles.downloadingButton}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.downloadingText}>Downloading...</Text>
              </View>
            ) : isDownloaded ? (
              <>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={onReadBook}>
                  <Ionicons name="book-outline" size={20} color={colors.text.inverse} />
                  <Text style={styles.primaryButtonText}>Read Book</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                  <Ionicons name="cloud-download-outline" size={20} color={colors.primary} />
                  <Text style={styles.downloadButtonText}>
                    Download ({formatBytes(estimatedSize)})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={onReadBook}>
                  <Ionicons name="book-outline" size={20} color={colors.text.inverse} />
                  <Text style={styles.primaryButtonText}>Read Online</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    height: height * 0.95,
    ...shadows.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: borderRadius.md,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  downloadedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  downloadedText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
  progressContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  progressPercentage: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  metadata: {
    marginBottom: spacing.lg,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  metadataLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  metadataValue: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  summaryContainer: {
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  summaryText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  downloadingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
  },
  downloadingText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  downloadButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
  },
});
