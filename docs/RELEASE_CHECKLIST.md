# Release Checklist - Pure Bhakti Base Mobile App v1.0.0

## Pre-Release Tasks

### Code Quality & Security
- [x] Run TypeScript compiler without errors: `npx tsc --noEmit`
- [x] All console logs are guarded by `__DEV__` or are legitimate error logging
- [x] No hardcoded secrets or API keys in codebase
- [x] All TODO/FIXME comments resolved or documented
- [x] No debugger statements in code
- [x] Security audit passed: `npm audit` (0 vulnerabilities found)
- [x] Dependencies are up to date
- [x] `.gitignore` properly excludes sensitive files (.env, keys, certificates)

### Functionality Testing
- [ ] **Library Screen**
  - [ ] Books load correctly in all three tabs (English, Tamil, Rays)
  - [ ] Search functionality works for all tabs
  - [ ] Book cards display correct thumbnails and titles
  - [ ] "View Details" opens the book details modal
  - [ ] Downloaded books show download badge (arrow-down-circle icon)
  - [ ] Offline badge appears when network is disconnected

- [ ] **Book Details Modal**
  - [ ] Book information displays correctly
  - [ ] "Read Book" button opens the reader
  - [ ] "Download Book" button initiates download
  - [ ] Download progress shows correctly
  - [ ] Storage warning appears when insufficient space
  - [ ] Modal closes properly

- [ ] **Reader Screen**
  - [ ] Book pages load and display correctly
  - [ ] Page navigation works (swipe and buttons)
  - [ ] Table of Contents opens and navigates correctly
  - [ ] Core Pages section displays and navigates correctly
  - [ ] "Jump to Page" functionality works
  - [ ] Share functionality works (if testing on device)
  - [ ] Offline reading works for downloaded books
  - [ ] Page numbers update correctly

- [ ] **Downloads Screen**
  - [ ] Downloaded books list displays correctly
  - [ ] Storage information is accurate
  - [ ] Individual book deletion works
  - [ ] "Delete All" works with confirmation
  - [ ] Hamburger menu navigation works
  - [ ] Empty state displays when no downloads

- [ ] **About Screen**
  - [ ] Logo displays correctly
  - [ ] All text content is accurate
  - [ ] Vision and Mission sections display properly
  - [ ] Copyright & Credits section is complete
  - [ ] "Permissions & Licensing" link opens browser
  - [ ] Email link opens mail app
  - [ ] Version number is correct (1.0.0)

- [ ] **Navigation**
  - [ ] Drawer opens from all screens
  - [ ] Navigation between screens works smoothly
  - [ ] Back navigation works correctly
  - [ ] Drawer closes when navigating to a screen

- [ ] **Offline Mode**
  - [ ] App detects network disconnection
  - [ ] Downloaded books are accessible offline
  - [ ] API calls fail gracefully when offline
  - [ ] Offline indicator appears on Library screen
  - [ ] App functions normally when network returns

### Platform-Specific Testing

#### iOS
- [ ] Test on iPhone (various screen sizes)
- [ ] Test on iPad
- [ ] Safe area insets work correctly (notch devices)
- [ ] Status bar displays correctly
- [ ] Splash screen displays correctly
- [ ] App icon displays correctly
- [ ] Photo library permission prompt works (when sharing)
- [ ] Dark mode appearance (if supported)
- [ ] Rotation handling (if enabled)

#### Android
- [ ] Test on various Android versions (minimum supported to latest)
- [ ] Test on various screen sizes
- [ ] Status bar displays correctly
- [ ] Splash screen displays correctly
- [ ] App icon displays correctly
- [ ] Adaptive icon works on supported devices
- [ ] Back button behavior is correct
- [ ] Permission prompts work correctly

### Performance
- [ ] App launches quickly (< 3 seconds on average device)
- [ ] Smooth scrolling in book lists
- [ ] Fast page transitions in reader
- [ ] Image loading is optimized
- [ ] No memory leaks during extended use
- [ ] Download progress updates smoothly
- [ ] App handles low memory situations gracefully

### Configuration
- [ ] API endpoints are correct in `app.json`
  - [ ] API base URL: https://purebhaktibase.com:8443
  - [ ] Image base URL: https://purebhaktibase.com
- [ ] App name is correct: "Pure Bhakti Base"
- [ ] Bundle identifiers are set:
  - [ ] iOS: com.purebhaktibase.mobile
  - [ ] Android: com.purebhaktibase.mobile
- [ ] App version is set to 1.0.0
- [ ] App icon is set and displays correctly
- [ ] Splash screen is configured

### Documentation
- [x] README.md is complete and accurate
- [x] SECURITY.md is up to date
- [x] Release checklist is complete (this file)
- [ ] Screenshots for app store are prepared
- [ ] Privacy policy is prepared (if required)
- [ ] App store descriptions are written

### Legal & Compliance
- [ ] Copyright information is accurate in About screen
- [ ] License information is correct
- [ ] Content attribution is proper
- [ ] Contact information is correct:
  - [ ] GVP email: gvp.contactus@gmail.com
  - [ ] Licensing link: https://purebhakti.com/pluslicense

## Build Process

### iOS Build
- [ ] Developer account is active
- [ ] Certificates are valid
- [ ] Provisioning profiles are set up
- [ ] App identifier is registered
- [ ] Build settings are configured for production
- [ ] Archive build succeeds: `expo build:ios`
- [ ] Upload to TestFlight succeeds
- [ ] TestFlight build is tested
- [ ] Submit to App Store Review

### Android Build
- [ ] Google Play Console is set up
- [ ] App is created in Play Console
- [ ] Keystore is generated and secured
- [ ] Build settings are configured for production
- [ ] App bundle build succeeds: `expo build:android`
- [ ] Upload to Play Console succeeds
- [ ] Internal testing track is tested
- [ ] Submit to Google Play Review

## App Store Submission

### App Store (iOS)
- [ ] App name: Pure Bhakti Base
- [ ] Keywords selected
- [ ] Description written
- [ ] Screenshots uploaded (all required sizes)
- [ ] Privacy policy URL (if required)
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Categories selected
- [ ] Content rating completed
- [ ] Pricing and availability set

### Google Play (Android)
- [ ] App name: Pure Bhakti Base
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Screenshots uploaded (all required sizes)
- [ ] Feature graphic uploaded
- [ ] App icon uploaded
- [ ] Content rating questionnaire completed
- [ ] Pricing and distribution set
- [ ] Target audience and content selected

## Post-Release

### Monitoring
- [ ] Monitor crash reports (Expo, App Center, or other service)
- [ ] Monitor app store reviews
- [ ] Monitor download statistics
- [ ] Check for user-reported issues

### Marketing
- [ ] Announce release on relevant platforms
- [ ] Share with devotee community
- [ ] Prepare support documentation
- [ ] Set up feedback channels

### Maintenance Plan
- [ ] Schedule for security updates
- [ ] Plan for feature updates
- [ ] Set up user feedback system
- [ ] Document known issues and roadmap

## Known Issues / Limitations
- None currently identified for v1.0.0

## Version Information
- **Version**: 1.0.0
- **Build Date**: [To be filled at release]
- **Target Platforms**: iOS 13+, Android 6.0+
- **Expo SDK**: 54.0.31
- **React Native**: 0.81.5

## Team Sign-off
- [ ] Developer: [Name] - Date: ___________
- [ ] QA Tester: [Name] - Date: ___________
- [ ] Project Lead: [Name] - Date: ___________

---

**Note**: This checklist should be reviewed and updated for each release. Check off items as they are completed. Do not proceed to release until all items are checked.
