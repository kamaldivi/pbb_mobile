import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import type { Book } from '@/types/api';
import { BookCard } from './BookCard';
import { colors, spacing, typography } from '@/theme';

interface BookGridProps {
  books: Book[];
  onBookPress: (book: Book) => void;
  onViewDetails: (book: Book) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const { width } = Dimensions.get('window');
const COLUMN_GAP = spacing.md;
const HORIZONTAL_PADDING = spacing.md * 2;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - HORIZONTAL_PADDING - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  onBookPress,
  onViewDetails,
  isLoading = false,
  emptyMessage = 'No books found',
}) => {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading books...</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="book-outline" size={64} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={books}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <BookCard
            book={item}
            onPress={() => onBookPress(item)}
            onViewDetails={() => onViewDetails(item)}
          />
        </View>
      )}
      keyExtractor={(item) => item.book_id.toString()}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginRight: COLUMN_GAP,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
