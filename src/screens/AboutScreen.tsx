import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { AboutScreenProps } from '@/types/navigation';
import { NavigationDrawer } from '@/components/NavigationDrawer';
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';

const AboutScreen: React.FC<AboutScreenProps> = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const appVersion = '1.0.0';

  const handleOpenLink = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
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
        <Text style={styles.title}>About</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/pbb_logo.webp')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Pure Bhakti Base</Text>
          <Text style={styles.tagline}>
            Unlocking the Eternal Teachings of{'\n'}
            Yugācārya Śrīla Bhaktivedānta{'\n'}
            Nārāyaṇa Gosvāmī Mahārāja
          </Text>
        </View>

        {/* Vision */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vision</Text>
          <Text style={styles.bodyText}>
            To preserve, organize, and make accessible the divine teachings of Yugācārya Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja, inspiring and uplifting seekers on the sacred path of pure bhakti.
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission</Text>
          <Text style={styles.bodyText}>
            To serve as a spiritual companion for devotees by offering intelligent and intuitive access to Śrīla Gurudev's books and insights, enabling personalized, immersive, and multilingual learning experiences rooted in the authentic Gaudiya Vaiṣṇava tradition.
          </Text>
        </View>

        {/* Copyright & Credits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Copyright & Credits</Text>

          <View style={styles.creditBlock}>
            <Text style={styles.creditHeading}>
              Book and Magazine Content Rights
            </Text>
            <Text style={styles.creditText}>
              © Gaudiya Vedanta Publications{'\n'}
              Licensed under CC BY-ND 3.0
            </Text>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenLink('https://purebhakti.com/pluslicense')}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              <Text style={styles.linkButtonText}>Permissions & Licensing</Text>
              <Ionicons name="open-outline" size={16} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => handleOpenLink('mailto:gvp.contactus@gmail.com')}
              activeOpacity={0.7}
            >
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
              <Text style={styles.emailText}>gvp.contactus@gmail.com</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.creditBlock}>
            <Text style={styles.creditHeading}>
              Software & Gokul Bhajan Book Content Rights
            </Text>
            <Text style={styles.creditText}>
              © Gokul Bhajan Gaudiya Matha
            </Text>
          </View>

        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version {appVersion}</Text>
        </View>
      </ScrollView>

      {/* Navigation Drawer */}
      <NavigationDrawer
        visible={drawerVisible}
        currentRoute="About"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  bodyText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  creditBlock: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  creditHeading: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  creditSubheading: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  creditText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  linkButtonText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  emailText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  versionText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },
});

export default AboutScreen;
