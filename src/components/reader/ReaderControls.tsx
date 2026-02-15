import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '@/theme';

interface ReaderControlsProps {
  currentPage: number;
  totalPages: number;
  currentPageLabel: string | null;
  isBookmarked: boolean;
  isFullscreen: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  onToggleBookmark: () => void;
  onOpenTOC: () => void;
  onOpenGoToPage: () => void;
  onShare: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({
  currentPage,
  totalPages,
  currentPageLabel,
  isBookmarked,
  isFullscreen,
  onPreviousPage,
  onNextPage,
  onPageChange,
  onToggleBookmark,
  onOpenTOC,
  onOpenGoToPage,
  onShare,
  onToggleFullscreen,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  // Format page display: "A (1 of 440)" or just "(1 of 440)" if no label
  const pageDisplay = currentPageLabel
    ? `${currentPageLabel} (${currentPage} of ${totalPages})`
    : `(${currentPage} of ${totalPages})`;

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <View style={styles.container}>
      {/* Top bar with close button and page display */}
      <View style={[
        styles.topBar,
        { paddingTop: isFullscreen ? spacing.md : insets.top + spacing.sm }
      ]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.pageDisplay}>
          {pageDisplay}
        </Text>
        <TouchableOpacity onPress={onToggleFullscreen} style={styles.fullscreenButton}>
          <Ionicons
            name={isFullscreen ? 'contract-outline' : 'expand-outline'}
            size={24}
            color={colors.text.inverse}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomBar}>
        {/* Left side: TOC and Previous */}
        <View style={styles.bottomBarLeft}>
          <TouchableOpacity onPress={onOpenTOC} style={styles.tocButton}>
            <Ionicons name="list" size={28} color={colors.text.inverse} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPreviousPage}
            disabled={isPreviousDisabled}
            style={[styles.navButton, isPreviousDisabled && styles.navButtonDisabled]}
          >
            <Ionicons
              name="chevron-back"
              size={36}
              color={isPreviousDisabled ? colors.text.tertiary : colors.text.inverse}
            />
          </TouchableOpacity>
        </View>

        {/* Center: Page input for quick navigation */}
        <TouchableOpacity onPress={onOpenGoToPage} style={styles.pageInputTrigger}>
          <Text style={styles.pageInputText}>Go to page...</Text>
        </TouchableOpacity>

        {/* Right side: Next, Bookmark, Share */}
        <View style={styles.bottomBarRight}>
          <TouchableOpacity
            onPress={onNextPage}
            disabled={isNextDisabled}
            style={[styles.navButton, isNextDisabled && styles.navButtonDisabled]}
          >
            <Ionicons
              name="chevron-forward"
              size={36}
              color={isNextDisabled ? colors.text.tertiary : colors.text.inverse}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleBookmark} style={styles.bookmarkButton}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={28}
              color={isBookmarked ? colors.primary : colors.text.inverse}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={26} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    padding: spacing.xs,
  },
  pageDisplay: {
    fontSize: typography.sizes.sm,
    color: colors.text.inverse,
    fontWeight: typography.weights.medium,
    flex: 1,
    textAlign: 'center',
  },
  fullscreenButton: {
    padding: spacing.xs,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bottomBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tocButton: {
    padding: spacing.xs,
  },
  navButton: {
    padding: spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  bookmarkButton: {
    padding: spacing.xs,
  },
  shareButton: {
    padding: spacing.xs,
  },
  pageInputTrigger: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: borderRadius.md,
  },
  pageInputText: {
    fontSize: typography.sizes.sm,
    color: colors.text.inverse,
    opacity: 0.7,
  },
});
