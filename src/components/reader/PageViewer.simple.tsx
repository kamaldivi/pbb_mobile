import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { IMAGE_CONFIG } from '@/config/api.config';
import { offlineManager } from '@/services/offline/OfflineManager';
import { colors } from '@/theme';

interface PageViewerProps {
  bookId: number;
  pageNumber: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  isOffline?: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PageViewer: React.FC<PageViewerProps> = ({
  bookId,
  pageNumber,
  onSwipeLeft,
  onSwipeRight,
  isOffline = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Use local path if offline, otherwise use API URL
  const imageSource = isOffline
    ? { uri: offlineManager.getLocalPagePath(bookId, pageNumber) }
    : { uri: IMAGE_CONFIG.getBookPage(bookId, pageNumber) };

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={styles.image}
        contentFit="contain"
        transition={200}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        cachePolicy={isOffline ? "none" : "memory-disk"}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
