import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { TableOfContents as TOCItem } from '@/types/api';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';

interface TableOfContentsProps {
  visible: boolean;
  bookTitle: string;
  tocItems: TOCItem[];
  currentPage: number;
  isLoading?: boolean;
  onNavigate: (pageNumber: number) => void;
  onClose: () => void;
}

interface TocNode extends TOCItem {
  children: TocNode[];
}

// Build hierarchical tree from flat TOC list
const buildTocTree = (items: TOCItem[]): TocNode[] => {
  const nodeMap = new Map<number, TocNode>();
  const rootNodes: TocNode[] = [];

  // Create nodes
  items.forEach((item) => {
    nodeMap.set(item.toc_id, { ...item, children: [] });
  });

  // Build hierarchy
  items.forEach((item) => {
    const node = nodeMap.get(item.toc_id)!;
    if (item.parent_toc_id === null) {
      rootNodes.push(node);
    } else {
      const parent = nodeMap.get(item.parent_toc_id);
      if (parent) {
        parent.children.push(node);
      } else {
        // If parent not found, add to root
        rootNodes.push(node);
      }
    }
  });

  return rootNodes;
};

interface TocNodeItemProps {
  node: TocNode;
  level: number;
  currentPage: number;
  onNavigate: (pageNumber: number) => void;
}

const TocNodeItem: React.FC<TocNodeItemProps> = ({
  node,
  level,
  currentPage,
  onNavigate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const isCurrentPage = node.page_number === currentPage;

  const handlePress = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    if (node.page_number) {
      onNavigate(node.page_number);
    }
  };

  const indentWidth = level * spacing.lg;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.tocItem,
          { paddingLeft: spacing.md + indentWidth },
          isCurrentPage && styles.currentTocItem,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.tocItemContent}>
          {hasChildren && (
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={16}
              color={colors.text.secondary}
              style={styles.chevronIcon}
            />
          )}

          <Text
            style={[
              styles.tocLabel,
              !hasChildren && styles.tocLabelWithoutIcon,
              isCurrentPage && styles.currentTocLabel,
            ]}
            numberOfLines={2}
          >
            {node.toc_label || 'Untitled'}
          </Text>
        </View>

        {node.page_number && (
          <Text
            style={[
              styles.pageNumber,
              isCurrentPage && styles.currentPageNumber,
            ]}
          >
            {node.page_label || node.page_number}
          </Text>
        )}
      </TouchableOpacity>

      {hasChildren && isExpanded && (
        <View>
          {node.children.map((child) => (
            <TocNodeItem
              key={child.toc_id}
              node={child}
              level={level + 1}
              currentPage={currentPage}
              onNavigate={onNavigate}
            />
          ))}
        </View>
      )}
    </>
  );
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  visible,
  bookTitle,
  tocItems,
  currentPage,
  isLoading,
  onNavigate,
  onClose,
}) => {
  const tocTree = useMemo(() => buildTocTree(tocItems), [tocItems]);

  const handleNavigate = (pageNumber: number) => {
    onNavigate(pageNumber);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Table of Contents</Text>
            <Text style={styles.bookTitle} numberOfLines={1}>
              {bookTitle}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* TOC Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading table of contents...</Text>
          </View>
        ) : tocTree.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>
              No table of contents available for this book
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {tocTree.map((node) => (
              <TocNodeItem
                key={node.toc_id}
                node={node}
                level={0}
                currentPage={currentPage}
                onNavigate={handleNavigate}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
    ...shadows.sm,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  bookTitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.sm,
  },
  tocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
    minHeight: 44,
  },
  currentTocItem: {
    backgroundColor: colors.background.secondary,
  },
  tocItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  chevronIcon: {
    marginRight: spacing.xs,
  },
  tocLabel: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    flex: 1,
  },
  tocLabelWithoutIcon: {
    marginLeft: spacing.lg,
  },
  currentTocLabel: {
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  pageNumber: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
    minWidth: 40,
    textAlign: 'right',
  },
  currentPageNumber: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  loadingText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
