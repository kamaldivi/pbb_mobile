import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useOfflineStore } from '@/stores/offlineStore';

interface NavigationDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentRoute: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  id: keyof RootStackParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  visible,
  onClose,
  currentRoute,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { bookmarks } = useBookmarkStore();
  const { downloadedBooks } = useOfflineStore();

  const menuItems: MenuItem[] = [
    {
      id: 'Library',
      label: 'Library',
      icon: 'library',
    },
    {
      id: 'Downloads',
      label: 'Downloads',
      icon: 'cloud-download',
      badge: downloadedBooks.length,
    },
    {
      id: 'Bookmarks',
      label: 'Bookmarks',
      icon: 'bookmark',
      badge: bookmarks.length,
    },
    {
      id: 'About',
      label: 'About',
      icon: 'information-circle',
    },
  ];

  const handleNavigate = (screen: keyof RootStackParamList) => {
    // Don't navigate if already on the screen
    if (screen === currentRoute) {
      onClose();
      return;
    }

    // Navigate to the screen
    if (screen === 'Library' || screen === 'Downloads' || screen === 'Bookmarks' || screen === 'About') {
      navigation.navigate(screen);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'bottom']}>
        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Ionicons name="book" size={32} color={colors.primary} />
              <Text style={styles.appName}>Pure Bhakti Base</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView
            style={styles.menuContainer}
            contentContainerStyle={styles.menuContent}
          >
            {menuItems.map((item) => {
              const isActive = item.id === currentRoute;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleNavigate(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={isActive ? colors.primary : colors.text.primary}
                      style={styles.menuIcon}
                    />
                    <Text
                      style={[
                        styles.menuLabel,
                        isActive && styles.menuLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.badge !== undefined && item.badge > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerContainer: {
    width: '75%',
    maxWidth: 300,
    backgroundColor: colors.background.primary,
    ...shadows.lg,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  appName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  menuContainer: {
    flex: 1,
  },
  menuContent: {
    paddingVertical: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  menuItemActive: {
    backgroundColor: colors.background.secondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    color: colors.text.inverse,
    fontWeight: typography.weights.bold,
  },
});
