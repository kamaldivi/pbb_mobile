import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export const AppLoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/pbb_logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Pure Bhakti Base</Text>

        <Text style={styles.tagline}>
          Unlocking the Eternal Teachings of{'\n'}
          Yugācārya Śrīla Bhaktivedānta{'\n'}
          Nārāyaṇa Gosvāmī Mahārāja
        </Text>

        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  tagline: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  loader: {
    marginTop: spacing.lg,
  },
});
