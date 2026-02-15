import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { Book } from '@/types/api';
import { BookCard } from './BookCard';
import { colors, spacing, typography } from '@/theme';

interface SubgroupedBookListProps {
  gurudevBooks: Book[];
  gokulBhajanBooks: Book[];
  onBookPress: (book: Book) => void;
  onViewDetails: (book: Book) => void;
  isLoading?: boolean;
}

interface ListItem {
  type: 'header' | 'book';
  data: string | Book;
  span?: number; // How many columns this item should span
}

const NUM_COLUMNS = 2;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SubgroupedBookList: React.FC<SubgroupedBookListProps> = ({
  gurudevBooks,
  gokulBhajanBooks,
  onBookPress,
  onViewDetails,
  isLoading,
}) => {
  // Build flat list with headers that span full width
  const listItems: ListItem[] = React.useMemo(() => {
    const items: ListItem[] = [];

    // Add Gurudev section
    if (gurudevBooks.length > 0) {
      items.push({ type: 'header', data: "Gurudev's Books", span: NUM_COLUMNS });
      gurudevBooks.forEach((book) => {
        items.push({ type: 'book', data: book, span: 1 });
      });
    }

    // Add Gokul Bhajan section
    if (gokulBhajanBooks.length > 0) {
      items.push({ type: 'header', data: 'Gokul Bhajan Books', span: NUM_COLUMNS });
      gokulBhajanBooks.forEach((book) => {
        items.push({ type: 'book', data: book, span: 1 });
      });
    }

    return items;
  }, [gurudevBooks, gokulBhajanBooks]);

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading books...</Text>
      </View>
    );
  }

  if (listItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No books found</Text>
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
    if (item.type === 'header') {
      // First header has no top padding (SearchBar provides spacing)
      // Subsequent headers have top padding for separation
      const isFirstHeader = index === 0;
      return (
        <View style={[styles.headerContainer, isFirstHeader && styles.firstHeaderContainer]}>
          <Text style={styles.headerText}>{item.data as string}</Text>
        </View>
      );
    }

    const book = item.data as Book;
    return (
      <View style={styles.itemContainer}>
        <BookCard
          book={book}
          onPress={() => onBookPress(book)}
          onViewDetails={() => onViewDetails(book)}
        />
      </View>
    );
  };

  const getItemType = (item: ListItem) => {
    return item.type;
  };

  // Override item layout to make headers span full width
  const overrideItemLayout = (
    layout: { span?: number; size?: number },
    item: ListItem,
    index: number
  ) => {
    if (item.type === 'header') {
      layout.span = NUM_COLUMNS;
      // Don't set size - let FlashList calculate dynamically
    } else {
      layout.span = 1;
    }
  };

  return (
    <FlashList
      data={listItems}
      renderItem={renderItem}
      keyExtractor={(item, index) =>
        item.type === 'header' ? `header-${index}` : `book-${(item.data as Book).book_id}`
      }
      numColumns={NUM_COLUMNS}
      getItemType={getItemType}
      // @ts-ignore - overrideItemLayout exists but has type issues in FlashList v2
      overrideItemLayout={overrideItemLayout}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  firstHeaderContainer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  itemContainer: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
});
