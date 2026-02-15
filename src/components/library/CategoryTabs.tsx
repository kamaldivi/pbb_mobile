import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { BookCategory } from '@/types/models';
import { colors, spacing, typography } from '@/theme';
import { getCategoryLabel } from '@/utils/bookCategories';

interface CategoryTabsProps {
  activeTab: BookCategory;
  onTabChange: (tab: BookCategory) => void;
  counts: {
    english: number;
    tamil: number;
    rays: number;
  };
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: BookCategory[] = ['english', 'tamil', 'rays'];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, isActive && styles.activeTabText]}
              numberOfLines={1}
            >
              {getCategoryLabel(tab)}
            </Text>
            <Text style={[styles.countText, isActive && styles.activeCountText]}>
              {counts[tab]} books
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    gap: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  activeTabText: {
    color: colors.text.inverse,
    fontWeight: typography.weights.bold,
  },
  countText: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
    color: colors.text.tertiary,
  },
  activeCountText: {
    color: colors.text.inverse,
  },
});
