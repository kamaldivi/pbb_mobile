import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { IMAGE_CONFIG } from '@/config/api.config';
import { colors } from '@/theme';

interface PageViewerProps {
  bookId: number;
  pageNumber: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Zoom configuration
const MIN_SCALE = 1;
const MAX_SCALE = 3;
const DOUBLE_TAP_ZOOM = 2.5;

// Swipe threshold
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 500;

export const PageViewer: React.FC<PageViewerProps> = ({
  bookId,
  pageNumber,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const imageUrl = IMAGE_CONFIG.getBookPage(bookId, pageNumber);

  // Zoom and pan values
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Reset zoom when page changes
  useEffect(() => {
    scale.value = withTiming(MIN_SCALE);
    savedScale.value = MIN_SCALE;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, [pageNumber]);

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      // Reset to MIN_SCALE if zoomed out close to it
      if (scale.value < MIN_SCALE + 0.1) {
        scale.value = withSpring(MIN_SCALE);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = MIN_SCALE;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  // Pan gesture for moving image when zoomed or swiping pages
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value > MIN_SCALE) {
        // When zoomed in, allow panning with bounds
        const maxTranslateX = ((scale.value - 1) * SCREEN_WIDTH) / 2;
        const maxTranslateY = ((scale.value - 1) * SCREEN_HEIGHT) / 2;

        const newTranslateX = savedTranslateX.value + event.translationX;
        const newTranslateY = savedTranslateY.value + event.translationY;

        // Clamp translation to prevent panning beyond image bounds
        translateX.value = Math.min(
          Math.max(newTranslateX, -maxTranslateX),
          maxTranslateX
        );
        translateY.value = Math.min(
          Math.max(newTranslateY, -maxTranslateY),
          maxTranslateY
        );
      } else {
        // When not zoomed, track horizontal swipe for page change (with damping)
        translateX.value = event.translationX * 0.5;
      }
    })
    .onEnd((event) => {
      if (scale.value > MIN_SCALE) {
        // Save pan position when zoomed
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      } else {
        // Detect swipe gestures when not zoomed
        const swipeDistance = event.translationX;
        const swipeVelocity = event.velocityX;

        // Swipe right (previous page)
        if (
          (swipeDistance > SWIPE_THRESHOLD || swipeVelocity > SWIPE_VELOCITY) &&
          onSwipeRight
        ) {
          runOnJS(onSwipeRight)();
        }
        // Swipe left (next page)
        else if (
          (swipeDistance < -SWIPE_THRESHOLD || swipeVelocity < -SWIPE_VELOCITY) &&
          onSwipeLeft
        ) {
          runOnJS(onSwipeLeft)();
        }

        // Reset position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  // Double tap to zoom in/out
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event) => {
      if (scale.value > MIN_SCALE) {
        // Zoom out to MIN_SCALE
        scale.value = withSpring(MIN_SCALE);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedScale.value = MIN_SCALE;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom in to DOUBLE_TAP_ZOOM, centered on tap location
        const tapX = event.x - SCREEN_WIDTH / 2;
        const tapY = event.y - SCREEN_HEIGHT / 2;

        scale.value = withSpring(DOUBLE_TAP_ZOOM);
        savedScale.value = DOUBLE_TAP_ZOOM;

        // Center zoom on tap location
        const maxTranslateX = ((DOUBLE_TAP_ZOOM - 1) * SCREEN_WIDTH) / 2;
        const maxTranslateY = ((DOUBLE_TAP_ZOOM - 1) * SCREEN_HEIGHT) / 2;

        const newTranslateX = -tapX * (DOUBLE_TAP_ZOOM - 1);
        const newTranslateY = -tapY * (DOUBLE_TAP_ZOOM - 1);

        translateX.value = withSpring(
          Math.min(Math.max(newTranslateX, -maxTranslateX), maxTranslateX)
        );
        translateY.value = withSpring(
          Math.min(Math.max(newTranslateY, -maxTranslateY), maxTranslateY)
        );

        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  // Compose gestures - double-tap takes priority, then pinch and pan work simultaneously
  const composedGesture = Gesture.Exclusive(
    doubleTapGesture,
    Gesture.Simultaneous(pinchGesture, panGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            cachePolicy="memory-disk"
          />
        </Animated.View>
      </GestureDetector>

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
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
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
