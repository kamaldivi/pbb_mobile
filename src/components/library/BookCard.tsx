import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Book } from '@/types/api';
import { IMAGE_CONFIG } from '@/config/api.config';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';
import { useOfflineStore } from '@/stores/offlineStore';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onViewDetails: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onViewDetails,
}) => {
  const { isBookDownloaded } = useOfflineStore();
  const thumbnailUrl = IMAGE_CONFIG.getBookThumbnail(book.book_id);
  const title = book.original_book_title || book.english_book_title || 'Untitled';
  const isDownloaded = isBookDownloaded(book.book_id);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          placeholder={require('../../../assets/icon.png')}
        />
        {isDownloaded && (
          <View style={styles.downloadedBadge}>
            <Ionicons name="arrow-down-circle" size={16} color={colors.text.inverse} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.detailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.background.secondary,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  downloadedBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  content: {
    padding: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  detailsText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
});
