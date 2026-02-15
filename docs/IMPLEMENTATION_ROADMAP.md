# Implementation Roadmap - Pure Bhakti Base Mobile App

**Target**: MVP Release in 5 Days
**Team**: You + Claude
**Approach**: Agile, iterative development with daily milestones

---

## Day-by-Day Breakdown

### 🚀 Day 1: Foundation & Setup

**Goal**: Get the development environment running and core architecture in place

#### Morning (4 hours)
- [ ] **Install Dependencies** (30 min)
  ```bash
  npm install @react-navigation/native @react-navigation/native-stack
  npm install zustand @tanstack/react-query
  npm install expo-image expo-secure-store expo-sqlite
  npm install react-native-gesture-handler react-native-reanimated
  npm install @shopify/flash-list
  npx expo install react-native-screens react-native-safe-area-context
  ```

- [ ] **Configure TypeScript** (30 min)
  - Set up `tsconfig.json`
  - Create type definitions in `src/types/`
  - Configure path aliases

- [ ] **Project Structure** (1 hour)
  - Create folder structure per architecture doc
  - Set up barrel exports (`index.ts` files)
  - Create placeholder files

- [ ] **API Configuration** (1 hour)
  - Set up Axios client (`src/services/api/client.ts`)
  - Configure API endpoints (`src/config/api.config.ts`)
  - Create API type definitions (`src/types/api.ts`)
  - Test API connection with health check

- [ ] **Navigation Setup** (1 hour)
  - Configure React Navigation
  - Set up stack navigator
  - Create navigation types
  - Test basic navigation flow

#### Afternoon (4 hours)
- [ ] **Theme System** (1 hour)
  - Set up colors (`src/theme/colors.ts`)
  - Configure typography
  - Create spacing constants
  - Export theme object

- [ ] **State Management** (1.5 hours)
  - Set up React Query provider
  - Create Zustand stores (library, reader, bookmarks)
  - Configure persistence for bookmarks
  - Test state updates

- [ ] **Image Configuration** (1 hour)
  - Configure Expo Image
  - Set up image URL helpers
  - Test loading thumbnails
  - Test loading page images

- [ ] **Shared Components** (30 min)
  - Create LoadingSpinner
  - Create ErrorBoundary
  - Create Button component
  - Create basic Modal

#### Evening Review
- [ ] Test app launches without errors
- [ ] Verify navigation works
- [ ] Verify API calls work
- [ ] Verify images load

**Deliverable**: Working app shell with navigation and API connection

---

### 📚 Day 2: Library Feature

**Goal**: Complete library screen with all functionality

#### Morning (4 hours)
- [ ] **Books API Integration** (1 hour)
  - Create `useBooks` hook with React Query
  - Implement books fetching logic
  - Handle pagination (fetch all books)
  - Add error handling

- [ ] **Library Screen Layout** (1 hour)
  - Create LibraryScreen component
  - Add header with title
  - Set up tab navigation structure
  - Add search bar placeholder

- [ ] **Category Tabs** (1 hour)
  - Create CategoryTabs component
  - Implement tab switching logic
  - Filter books by book_type
  - Persist active tab in store
  - Add book counts to tabs

- [ ] **Search Functionality** (1 hour)
  - Implement SearchBar component
  - Add search filtering (title + author)
  - Debounce search input
  - Clear search button
  - Show "no results" state

#### Afternoon (4 hours)
- [ ] **Book Grid** (1.5 hours)
  - Create BookGrid with FlashList
  - Implement 2-column responsive layout
  - Add scroll performance optimization
  - Handle empty states

- [ ] **Book Card Component** (1.5 hours)
  - Design book card layout
  - Load thumbnail images (16KB each, 144 total = 2.2MB)
  - Add press animation
  - Show book title
  - Add "View Details" button
  - Handle image load errors with fallback

- [ ] **Book Details Modal** (1 hour)
  - Create BookDetailsModal component
  - Show larger thumbnail
  - Display book metadata (title, author, summary)
  - Add "Read Book" button
  - Add "Close" button
  - Add smooth modal animations

#### Evening Testing
- [ ] Test all 3 tabs (English, Tamil, Rays)
- [ ] Test search across tabs
- [ ] Test book card interactions
- [ ] Test modal open/close
- [ ] Verify thumbnail loading performance
- [ ] Test on both iOS and Android

**Deliverable**: Fully functional library with 144 books browsable

---

### 📖 Day 3: Reader Foundation

**Goal**: Basic reader with page viewing and navigation

#### Morning (4 hours)
- [ ] **Reader Screen Setup** (30 min)
  - Create ReaderScreen component
  - Extract route params (bookId, page)
  - Set up layout structure
  - Add navigation header

- [ ] **Reader API Hooks** (1 hour)
  - Create `useBook` hook (book metadata)
  - Create `useBookPages` hook (page list)
  - Create `useBookTOC` hook (table of contents)
  - Handle loading states
  - Handle errors

- [ ] **Page Viewer Component** (1.5 hours)
  - Create PageViewer layout
  - Display WebP images (123KB avg)
  - Show loading spinner
  - Handle image errors
  - Implement aspect ratio preservation
  - Test with different book dimensions

- [ ] **ZoomableImage** (1 hour)
  - Implement pinch-to-zoom gesture
  - Add double-tap zoom
  - Configure zoom limits (1x - 3x)
  - Add pan within zoomed image
  - Smooth animations with reanimated

#### Afternoon (4 hours)
- [ ] **Page Navigation Bar** (2 hours)
  - Create PageNavigation component
  - Add Previous button (disabled on page 1)
  - Add Next button (disabled on last page)
  - Show current page info
  - Add page counter display
  - Style navigation bar (top + bottom)

- [ ] **Navigation Logic** (1 hour)
  - Implement next/previous page handlers
  - Update URL with page param
  - Sync navigation state
  - Handle boundary conditions

- [ ] **Image Preloading** (1 hour)
  - Create `useImagePreload` hook
  - Preload next 2 pages
  - Preload previous 1 page
  - WiFi detection
  - Priority-based loading

#### Evening Testing
- [ ] Navigate through multiple books
- [ ] Test zoom and pan gestures
- [ ] Verify preloading works
- [ ] Check memory usage
- [ ] Test page boundaries
- [ ] Verify image quality on different devices

**Deliverable**: Working reader with smooth page viewing

---

### 🗂️ Day 4: TOC & Advanced Navigation

**Goal**: Table of contents and complete navigation features

#### Morning (4 hours)
- [ ] **TOC Drawer Component** (1.5 hours)
  - Create TOCDrawer (bottom slide-up)
  - Implement open/close animations
  - Add backdrop blur
  - Handle gesture to close
  - Position controls

- [ ] **TOC Tree Component** (1.5 hours)
  - Create TOCTree with hierarchical display
  - Implement expand/collapse nodes
  - Add indentation based on level
  - Show page numbers
  - Handle clicks to navigate

- [ ] **TOC Navigation** (1 hour)
  - Connect TOC items to page navigation
  - Auto-close drawer after selection
  - Highlight current chapter (optional)
  - Smooth scroll to page

#### Afternoon (4 hours)
- [ ] **Go To Page Dialog** (1.5 hours)
  - Create GoToPageDialog modal
  - Input field for page number/label
  - Validate input
  - Support Roman numerals (i, ii, iii)
  - Support page numbers
  - Error messages
  - Keyboard submission

- [ ] **Swipe Gestures** (1 hour)
  - Implement horizontal swipe (prev/next page)
  - Configure gesture handler
  - Prevent conflicts with zoom
  - Add visual feedback
  - Test gesture sensitivity

- [ ] **Fullscreen Mode** (1.5 hours)
  - Create FullscreenViewer component
  - Implement enter/exit fullscreen
  - Overlay navigation controls
  - Hide system UI bars
  - Double-tap to toggle
  - Swipe navigation in fullscreen

#### Evening Testing
- [ ] Test TOC drawer on small screens
- [ ] Test hierarchical TOC navigation
- [ ] Test page jumping with various inputs
- [ ] Test swipe gestures smoothness
- [ ] Test fullscreen mode
- [ ] Verify all navigation methods work together

**Deliverable**: Complete navigation system with TOC

---

### ⭐ Day 5: Features, Polish & Release

**Goal**: Bookmarks, sharing, optimization, and release preparation

#### Morning (4 hours)
- [ ] **Bookmark Feature** (2 hours)
  - Create BookmarkButton component
  - Implement bookmark store (Zustand + persist)
  - Add bookmark creation
  - Add bookmark removal
  - Show bookmark state (filled/outline)
  - Save to SecureStore

- [ ] **Last Read Page Tracking** (1 hour)
  - Create reading progress storage
  - Save last page on navigation
  - Load last page on book open
  - Add "Continue Reading" indicator in library

- [ ] **Share Functionality** (1 hour)
  - Create ShareButton component
  - Use Expo Sharing API
  - Generate share URLs with deep links
  - Format share message
  - Test WhatsApp, email, copy link

#### Afternoon (4 hours)
- [ ] **Performance Optimization** (1.5 hours)
  - Add list virtualization checks
  - Optimize re-renders with React.memo
  - Check memory usage with large books
  - Reduce bundle size
  - Test on low-end devices

- [ ] **Error Handling** (1 hour)
  - Add error boundaries
  - Improve error messages
  - Add retry buttons
  - Handle network errors gracefully
  - Add offline indicators

- [ ] **UI Polish** (1.5 hours)
  - Refine animations and transitions
  - Add haptic feedback
  - Improve loading states
  - Polish button styles
  - Final visual tweaks
  - Add app icon and splash screen

#### Evening: Testing & Release Prep
- [ ] **Comprehensive Testing** (2 hours)
  - Test all features end-to-end
  - Test on multiple iOS devices
  - Test on multiple Android devices
  - Test different screen sizes
  - Test network conditions (WiFi, 4G, offline)
  - Test memory with large books (500+ pages)

- [ ] **Build & Deploy** (1 hour)
  - Configure EAS Build
  - Create production builds
  - Test builds on physical devices
  - Prepare for TestFlight/Internal Testing

**Deliverable**: Polished MVP ready for user testing

---

## Daily Review Checklist

### End of Each Day:
- [ ] All planned features completed
- [ ] No blocking bugs
- [ ] Tested on both platforms
- [ ] Code committed to version control
- [ ] Documentation updated
- [ ] Tomorrow's tasks reviewed

---

## Success Metrics for MVP

### Performance Targets
- ✅ App launch: < 2 seconds
- ✅ Library load: < 1 second
- ✅ Page navigation: < 500ms
- ✅ Image load: < 2 seconds
- ✅ Smooth 60 FPS animations

### Feature Completeness
- ✅ 144 books displayed in library
- ✅ All 3 categories functional
- ✅ Search works across titles and authors
- ✅ Reader loads all page types
- ✅ TOC navigates correctly
- ✅ All 5 navigation methods work
- ✅ Bookmarks save and load
- ✅ Sharing generates correct deep links
- ✅ Last read page resumes correctly

### Quality Gates
- ✅ No crashes on startup
- ✅ No memory leaks on long sessions
- ✅ Works on iOS 13+ and Android 8+
- ✅ Handles network errors gracefully
- ✅ Images load on all devices
- ✅ Gestures work smoothly

---

## Risk Mitigation

### Potential Issues & Solutions

| Risk | Impact | Mitigation |
|------|--------|------------|
| **WebP compatibility** | HIGH | Use Expo Image (native support) |
| **Memory issues with images** | HIGH | Aggressive cache management, limit preload |
| **Slow page loading** | MEDIUM | Implement smart preloading, compression |
| **TOC rendering performance** | MEDIUM | Virtualize long TOC lists |
| **API rate limiting** | LOW | Cache aggressively, batch requests |
| **Build failures** | MEDIUM | Test builds daily, maintain EAS config |

---

## Post-MVP Enhancements

### Week 2 (After User Feedback)
- [ ] Bookmarks management screen
- [ ] Reading history
- [ ] Improved offline support
- [ ] Dark mode
- [ ] Performance optimizations based on analytics

### Month 2
- [ ] Full offline book downloads
- [ ] Download manager
- [ ] Enhanced search (full-text)
- [ ] Glossary integration
- [ ] Reading statistics

---

## Development Tips

### Productivity Boosters
1. **Use Expo Go** for rapid testing on physical devices
2. **Hot reload** for instant feedback during development
3. **React DevTools** for debugging state issues
4. **Expo CLI** for quick tasks (tunnel, clear cache)

### Common Commands
```bash
# Start with tunnel (access from any device)
npx expo start --tunnel

# Clear cache if issues
npx expo start --clear

# Check bundle size
npx expo export --dump-sourcemap

# Type check
npm run type-check

# Build for testing
eas build --profile preview --platform all
```

### Debugging Tips
- Use `console.log` liberally during development
- Test on real devices early and often
- Monitor memory usage in Xcode/Android Studio
- Use React Query DevTools for API debugging
- Check network tab for failed image loads

---

## Ready to Start?

The roadmap is set! Here's what we'll do next:

1. **You approve** this roadmap and architecture
2. **I'll start Day 1** immediately with dependency installation
3. **We work through** each day systematically
4. **Daily check-ins** to adjust as needed
5. **MVP release** by Day 5

Let's build this app! 🚀

---

**Document Version**: 1.0
**Last Updated**: 2026-01-08
**Status**: Ready to Execute
