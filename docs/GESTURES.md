# Reader Gestures Documentation

## Overview

The PDF reader supports intuitive touch gestures for navigation and zoom, working seamlessly on both iOS and Android devices.

## Implemented Gestures

### 1. **Horizontal Swipe** (Page Navigation)
**When**: Not zoomed in (1x zoom)
- **Swipe Left** → Next page
- **Swipe Right** → Previous page
- **Threshold**: 50px distance OR 500px/s velocity
- **Visual feedback**: Page slides slightly during swipe (dampened at 0.5x)

### 2. **Pinch to Zoom**
**When**: Anytime
- **Pinch out** → Zoom in (up to 3x)
- **Pinch in** → Zoom out (down to 1x)
- **Zoom range**: 1x (MIN) to 3x (MAX) - Conservative for text readability
- **Auto-reset**: If zoomed out close to 1x (< 1.1x), automatically snaps back to 1x

### 3. **Double-Tap Zoom**
**When**: Anytime
- **Double-tap when not zoomed** → Zoom to 2.5x centered on tap location
- **Double-tap when zoomed** → Zoom out to 1x
- **Smart centering**: Zoom focuses on the tapped area

### 4. **Pan Gesture** (Two Modes)
**When zoomed in**:
- Pan freely to explore the zoomed page
- **Bounds**: Cannot pan beyond image edges
- **Smooth movement**: Position saved between pan gestures

**When not zoomed in**:
- Horizontal pan triggers page change (same as swipe)
- Used for page navigation

### 5. **Auto-Reset on Page Change**
**When**: Navigating to a new page (via any method)
- Zoom automatically resets to 1x
- Pan position resets to center
- Smooth animation

## Technical Implementation

### Libraries Used
- **react-native-gesture-handler**: Cross-platform gesture recognition
- **react-native-reanimated**: 60fps native-thread animations

### Gesture Composition
```
Gesture.Exclusive(
  doubleTapGesture,              // Takes priority
  Gesture.Simultaneous(
    pinchGesture,                 // Can happen together
    panGesture
  )
)
```

### Key Features
1. **Native thread performance**: Gestures run at 60fps on both platforms
2. **Proper bounds checking**: Can't pan or zoom beyond limits
3. **Smooth animations**: Uses spring/timing animations for natural feel
4. **Conflict resolution**: Double-tap takes priority over other gestures
5. **Page change integration**: Works seamlessly with button controls

## User Experience

### Zoom Behavior
- **Min Zoom (1x)**: Default view, full page visible
- **Max Zoom (3x)**: Close-up for detailed reading
- **Double-Tap Zoom (2.5x)**: Quick zoom for text inspection

### Page Navigation Priority
When zoomed in and panned to the edge:
- **Immediate page change**: Swipe changes page right away (Option A)
- No extra gesture strength needed

### Visual Feedback
- **Swipe**: Page slides with finger (dampened)
- **Zoom**: Smooth spring animation
- **Pan**: Direct 1:1 finger tracking
- **Page change**: Automatic zoom reset with animation

## Platform Support

✅ **iOS**: Full support, tested on iOS 15+
✅ **Android**: Full support, tested on Android 10+
✅ **Expo Go**: Works in development mode (SDK 54+)
✅ **Production builds**: Optimal performance

## Configuration

Located in: `src/components/reader/PageViewer.tsx`

```typescript
// Zoom limits
const MIN_SCALE = 1;          // Minimum zoom (no zoom)
const MAX_SCALE = 3;          // Maximum zoom (conservative)
const DOUBLE_TAP_ZOOM = 2.5;  // Quick zoom level

// Swipe sensitivity
const SWIPE_THRESHOLD = 50;    // Minimum distance (px)
const SWIPE_VELOCITY = 500;    // Minimum speed (px/s)
```

## Future Enhancements

Potential improvements for future versions:
- [ ] Configurable zoom limits (user preference)
- [ ] Triple-tap for max zoom
- [ ] Zoom level indicator
- [ ] Persistent zoom preference across pages
- [ ] Rotation support
- [ ] Two-finger pan for locked zoom level
