# App Store Release Guide - Pure Bhakti Base Mobile

## Complete Step-by-Step Guide to Publishing on iOS and Android

This guide covers everything you need to release the Pure Bhakti Base mobile app to the Apple App Store and Google Play Store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Developer Account Setup](#developer-account-setup)
3. [Build Tools Setup](#build-tools-setup)
4. [Pre-Release Checklist](#pre-release-checklist)
5. [Building for iOS](#building-for-ios)
6. [Building for Android](#building-for-android)
7. [App Store Submission](#app-store-submission)
8. [Play Store Submission](#play-store-submission)
9. [Post-Release Monitoring](#post-release-monitoring)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need Before Starting

- ✅ Completed app codebase (you have this)
- ✅ Tested app thoroughly on both platforms
- ✅ App assets (icons, splash screens, screenshots)
- ✅ Apple Developer account ($99/year)
- ✅ Google Play Developer account ($25 one-time)
- ✅ macOS computer (required for iOS builds)
- ✅ App store listings prepared (descriptions, keywords, etc.)

---

## Developer Account Setup

### Apple Developer Account

**Cost:** $99 USD per year

**Steps:**

1. **Create Apple ID** (if you don't have one)
   - Go to https://appleid.apple.com
   - Create new Apple ID with your email
   - Verify email address

2. **Enroll in Apple Developer Program**
   - Go to https://developer.apple.com/programs/enroll/
   - Click "Start Your Enrollment"
   - Sign in with Apple ID
   - Choose account type:
     - **Individual**: If publishing as yourself
     - **Organization**: If publishing as Pure Bhakti (requires D-U-N-S number)
   - Complete enrollment form
   - Pay $99 USD annual fee
   - **Wait time:** 24-48 hours for approval

3. **Accept Agreements**
   - Log in to https://developer.apple.com/account
   - Accept Apple Developer Program License Agreement
   - Accept Paid Applications Agreement (in App Store Connect)

**Important Notes:**
- Renewal is automatic ($99/year)
- If organization account: Get D-U-N-S number first (free, takes 1-2 weeks)
- Can't submit apps without active membership

---

### Google Play Developer Account

**Cost:** $25 USD one-time fee

**Steps:**

1. **Create Google Account** (if you don't have one)
   - Go to https://accounts.google.com
   - Create new account
   - Verify email and phone

2. **Register as Developer**
   - Go to https://play.google.com/console/signup
   - Sign in with Google account
   - Accept Google Play Developer Distribution Agreement
   - Pay $25 USD one-time registration fee
   - Complete account details:
     - Developer name (shown to users)
     - Email address
     - Phone number
     - Website (optional but recommended)
   - **Wait time:** Usually instant, can take up to 48 hours

3. **Verify Identity** (Required since 2023)
   - Google may require identity verification
   - Provide government-issued ID
   - Verification takes 1-3 days

**Important Notes:**
- No annual renewal (one-time $25 fee)
- Account can be suspended for policy violations
- Keep account in good standing

---

## Build Tools Setup

### Option 1: Expo Application Services (EAS) - **RECOMMENDED** ✅

**Why EAS is Recommended:**
- ✅ No need for Xcode or Android Studio
- ✅ Cloud-based builds (works on any computer)
- ✅ Handles signing automatically
- ✅ Easier for beginners
- ✅ Free tier available (limited builds/month)
- ✅ Works on macOS, Windows, Linux

**Setup Steps:**

#### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login to Expo Account

```bash
# If you don't have Expo account, create one at https://expo.dev
eas login
```

#### 3. Configure EAS for Your Project

```bash
cd /Users/kamaldivi/Development/web_apps/pbb_mobile

# Initialize EAS
eas build:configure
```

This creates `eas.json` with default configuration:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### 4. Update app.json for Production

Your `app.json` needs store-ready configuration:

```json
{
  "expo": {
    "name": "Pure Bhakti Base",
    "slug": "pure-bhakti-base",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.purebhaktibase.mobile",
      "supportsTablet": true,
      "buildNumber": "1",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Allow Pure Bhakti Base to save book pages to your photo library.",
        "NSCameraUsageDescription": "Allow Pure Bhakti Base to take photos for sharing."
      }
    },
    "android": {
      "package": "com.purebhaktibase.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow Pure Bhakti Base to access your photos for sharing book pages."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID_HERE"
      }
    }
  }
}
```

**Important:** Replace `"YOUR_PROJECT_ID_HERE"` with your actual Expo project ID (get from `eas build:configure`).

#### 5. EAS Build Pricing

**Free Tier:**
- iOS: 30 builds/month
- Android: 30 builds/month
- Shared build queue (slower)

**Paid Plans:**
- Production: $99/month (unlimited builds, priority queue)
- Production + Support: $299/month

**Recommendation for You:**
- Start with **free tier** for v1.0 release
- Upgrade only if you need frequent builds

---

### Option 2: Local Builds (Traditional)

**Warning:** This is more complex and requires specific hardware/software.

#### macOS Requirements (for iOS builds)

**Required:**
- macOS 13.0 (Ventura) or later
- Xcode 15.0 or later (from Mac App Store - ~15 GB download)
- Xcode Command Line Tools
- CocoaPods (for iOS dependencies)

**Setup:**

```bash
# Install Xcode from Mac App Store (takes 1-2 hours)
# Then install Command Line Tools:
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Install Expo CLI
npm install -g expo-cli

# Install iOS Simulator (optional, for testing)
# Already included in Xcode
```

#### Android Requirements (macOS, Windows, or Linux)

**Required:**
- Android Studio (latest version - ~3 GB download)
- Android SDK
- Java Development Kit (JDK) 17 or later

**Setup:**

```bash
# Download Android Studio from https://developer.android.com/studio

# After installation, open Android Studio and install:
# - Android SDK Platform 34 (API Level 34)
# - Android SDK Build-Tools
# - Android Emulator (optional, for testing)

# Set environment variables (add to ~/.zshrc or ~/.bash_profile):
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Reload shell
source ~/.zshrc  # or source ~/.bash_profile
```

**Recommendation:** Unless you have specific reasons, **use EAS (Option 1)** instead.

---

## Pre-Release Checklist

### Code & Testing

- [ ] All features tested on both iOS and Android
- [ ] No console errors or warnings
- [ ] Offline functionality tested
- [ ] App works on slow/unstable networks
- [ ] All links and URLs work correctly
- [ ] Images load correctly (book covers, icons)
- [ ] Downloads work and cleanup works
- [ ] Reader navigation works smoothly
- [ ] Search functionality works
- [ ] Error handling tested (no internet, server down, etc.)

### App Configuration

- [ ] `app.json` version set correctly (e.g., "1.0.0")
- [ ] `app.json` buildNumber (iOS) and versionCode (Android) set to 1
- [ ] Bundle identifier (iOS) and package name (Android) are unique and correct
- [ ] App name is correct
- [ ] App icon created (1024x1024 PNG)
- [ ] Splash screen created
- [ ] Adaptive icon created (Android)
- [ ] Permissions correctly configured

### Legal & Content

- [ ] Privacy Policy prepared and hosted (required by both stores)
- [ ] Terms of Service prepared (if applicable)
- [ ] Support URL/email configured
- [ ] Copyright notices in place
- [ ] App description written (short and full)
- [ ] Keywords selected (App Store)
- [ ] Screenshots prepared (see requirements below)
- [ ] App category selected
- [ ] Age rating determined (likely 4+ or Everyone)

### Assets Required

#### App Icon
- **Size:** 1024x1024 pixels
- **Format:** PNG (no transparency)
- **Your file:** `assets/icon.png` (verify it's 1024x1024)

#### Splash Screen
- **Size:** 1284x2778 pixels (iPhone 13 Pro Max)
- **Format:** PNG
- **Your file:** `assets/splash.png`

#### iOS Screenshots (Required)

**6.7" Display (iPhone 14 Pro Max):**
- Size: 1290 x 2796 pixels
- Need: 3-10 screenshots
- **Recommended:** 5 screenshots showing key features

**5.5" Display (iPhone 8 Plus):**
- Size: 1242 x 2208 pixels
- Need: 3-10 screenshots
- **Optional but recommended**

**How to capture:**
1. Run app in iOS Simulator
2. Use Simulator → File → Save Screen

#### Android Screenshots (Required)

**Phone Screenshots:**
- Size: 1080 x 1920 pixels (minimum)
- Need: 2-8 screenshots
- **Recommended:** 5 screenshots

**Tablet Screenshots (Optional):**
- Size: 1600 x 2560 pixels
- Need: 2-8 screenshots

**How to capture:**
1. Run app in Android Emulator
2. Use emulator screenshot tool

**Screenshot Tips:**
- Show key features (Library, Reader, Downloads, About)
- Use real content (actual books from your catalog)
- Keep text readable
- Show app in action
- Avoid showing splash screen

#### App Store Listing Content

**App Name:**
- iOS: Max 30 characters
- Android: Max 50 characters
- **Suggested:** "Pure Bhakti Base"

**Subtitle (iOS only):**
- Max 30 characters
- **Suggested:** "Sacred Literature Library"

**Short Description (Android only):**
- Max 80 characters
- **Suggested:** "Read sacred Vaishnava literature offline. Thousands of pages available."

**Full Description:**

```
Pure Bhakti Base brings you a comprehensive library of sacred Vaishnava literature in English, Tamil, and other languages.

FEATURES:
• Browse thousands of pages of spiritual literature
• Download books for offline reading
• Beautiful, distraction-free reading experience
• Navigate with table of contents
• Jump to any page instantly
• Share passages with friends
• Search across all books
• Automatic content updates

CATEGORIES:
📚 English Books - Classic and contemporary Vaishnava literature
🕉️ Tamil Books - Sacred texts in Tamil language
✨ Rays of The Harmonist - Spiritual magazine archives

OFFLINE READING:
Download your favorite books and read them anywhere, anytime, even without internet connection. Manage your downloads and storage easily.

ABOUT PURE BHAKTI:
Pure Bhakti Base is the official mobile app of Pure Bhakti, dedicated to preserving and sharing authentic Vaishnava teachings.

SUPPORT:
Contact us at [your support email]
Privacy Policy: https://purebhaktibase.com/privacy
Terms of Service: https://purebhaktibase.com/terms
```

**Keywords (iOS only):**
- Max 100 characters
- Comma-separated
- **Suggested:** "vaishnava,spiritual,books,religion,hinduism,bhakti,krishna,literature,offline,reading"

**Category:**
- **Primary:** Books (iOS) / Books & Reference (Android)
- **Secondary:** Education or Lifestyle

**Age Rating:**
- **iOS:** 4+
- **Android:** Everyone

---

## Building for iOS

### Using EAS (Recommended)

#### Step 1: Create Build

```bash
cd /Users/kamaldivi/Development/web_apps/pbb_mobile

# Create production build for iOS
eas build --platform ios --profile production
```

**What happens:**
1. Code uploaded to Expo servers
2. Dependencies installed
3. Native iOS project generated
4. App compiled and signed
5. `.ipa` file created
6. **Time:** 10-20 minutes

#### Step 2: Download Build

After build completes:

```bash
# Download .ipa file
eas build:download --platform ios
```

Or download from Expo dashboard at https://expo.dev/accounts/[your-account]/projects/pure-bhakti-base/builds

#### Step 3: Submit to App Store

```bash
# Submit directly from EAS (easiest method)
eas submit --platform ios
```

**OR** manually upload via Transporter app (see App Store Submission section below).

---

### Using Xcode (Traditional Method)

**Note:** Only use this if you can't use EAS.

#### Step 1: Generate Native iOS Project

```bash
cd /Users/kamaldivi/Development/web_apps/pbb_mobile

# Prebuild native project
npx expo prebuild --platform ios
```

This creates `ios/` directory with Xcode project.

#### Step 2: Install Dependencies

```bash
cd ios
pod install
cd ..
```

#### Step 3: Open in Xcode

```bash
open ios/PureBhaktiBase.xcworkspace
```

**Important:** Open `.xcworkspace`, NOT `.xcodeproj`

#### Step 4: Configure Signing

In Xcode:
1. Select project in left sidebar
2. Select "PureBhaktiBase" target
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select your Team (Apple Developer account)
6. Bundle Identifier: `com.purebhaktibase.mobile`

#### Step 5: Archive

1. In Xcode: Product → Destination → Any iOS Device (arm64)
2. Product → Archive
3. Wait 5-10 minutes for archive to complete
4. Organizer window opens with your archive
5. Click "Distribute App"
6. Select "App Store Connect"
7. Follow wizard to upload

**Time:** 15-30 minutes total

---

## Building for Android

### Using EAS (Recommended)

#### Step 1: Create Build

```bash
cd /Users/kamaldivi/Development/web_apps/pbb_mobile

# Create production build for Android
eas build --platform android --profile production
```

**What happens:**
1. Code uploaded to Expo servers
2. Dependencies installed
3. Native Android project generated
4. App compiled and signed
5. `.aab` file created (Android App Bundle)
6. **Time:** 10-20 minutes

**Important:** EAS automatically creates and manages signing keys for you.

#### Step 2: Download Build

```bash
# Download .aab file
eas build:download --platform android
```

Or download from Expo dashboard.

#### Step 3: Submit to Play Store

```bash
# Submit directly from EAS
eas submit --platform android
```

**OR** manually upload via Play Console (see Play Store Submission section below).

---

### Using Android Studio (Traditional Method)

**Note:** Only use this if you can't use EAS.

#### Step 1: Generate Native Android Project

```bash
cd /Users/kamaldivi/Development/web_apps/pbb_mobile

# Prebuild native project
npx expo prebuild --platform android
```

This creates `android/` directory.

#### Step 2: Generate Signing Key

You need a keystore to sign your app:

```bash
# Generate keystore (do this ONCE and keep it safe!)
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# You'll be asked for:
# - Keystore password (remember this!)
# - Key password (remember this!)
# - Your name, organization, etc.
```

**CRITICAL:**
- Backup this keystore file somewhere safe!
- If you lose it, you can NEVER update your app again!
- Store passwords securely!

#### Step 3: Configure Gradle for Signing

Edit `android/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your_keystore_password
MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
```

**Security Warning:** Don't commit this file to git! Add to `.gitignore`

#### Step 4: Build Release

```bash
cd android

# Build release AAB
./gradlew bundleRelease

# Your .aab file will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

**Time:** 5-10 minutes

---

## App Store Submission (iOS)

### Prerequisites

- [ ] Apple Developer account active
- [ ] `.ipa` file ready (from EAS or Xcode)
- [ ] Screenshots prepared
- [ ] App Store listing content written
- [ ] Privacy Policy URL available

### Step-by-Step Process

#### 1. Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with Apple ID
3. Click "My Apps"
4. Click "+" button → "New App"
5. Fill out form:
   - **Platform:** iOS
   - **Name:** Pure Bhakti Base
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** com.purebhaktibase.mobile
   - **SKU:** purebhaktibase-mobile-001 (unique identifier, your choice)
   - **User Access:** Full Access
6. Click "Create"

#### 2. Fill Out App Information

**General Information:**
- App Name: Pure Bhakti Base
- Subtitle: Sacred Literature Library
- Category: Books (primary), Education (secondary)

**Privacy:**
- Privacy Policy URL: https://purebhaktibase.com/privacy (you need to create this!)
- Does app collect data? → Yes (if using analytics) or No

**App Privacy Questions:**
Answer questions about data collection:
- Contact Info? No
- Location? No
- User Content? Possibly (if downloads are tied to accounts)
- Identifiers? Only if using analytics

#### 3. Prepare for Submission

Click on "1.0.0 Prepare for Submission":

**Screenshots and App Previews:**
- Upload screenshots for 6.7" Display (required)
- Upload screenshots for 5.5" Display (recommended)
- Drag to reorder (first screenshot is most important)

**Description:**
Paste your full description (see Pre-Release Checklist section)

**Keywords:**
Enter comma-separated keywords (max 100 chars)

**Support URL:**
https://purebhaktibase.com/support (create this page)

**Marketing URL (optional):**
https://purebhaktibase.com

**Version:**
1.0.0

**Copyright:**
2026 Pure Bhakti (or your organization name)

**Rating:**
- Click "Edit"
- Answer content questions (likely all "None" or "Infrequent")
- Should result in "4+" rating

**App Review Information:**
- First Name: [Your name]
- Last Name: [Your last name]
- Phone: [Your phone with country code]
- Email: [Your support email]
- Demo Account (if login required): N/A (your app doesn't require login)
- Notes: "App provides access to spiritual literature library. No user accounts required. All content is free."

**Version Release:**
- Automatically release this version
- OR: Manually release this version (you choose when)

#### 4. Upload Build

**Method A: Using EAS (if you used eas submit)**
Already uploaded! Skip to step 5.

**Method B: Using Transporter App**

1. Download Transporter from Mac App Store
2. Open Transporter
3. Sign in with Apple ID
4. Drag and drop your `.ipa` file
5. Click "Deliver"
6. Wait for upload to complete (5-15 minutes depending on internet speed)

**Method C: Using Xcode**
(Already done if you used Xcode Archive method above)

#### 5. Select Build for Submission

1. In App Store Connect, scroll to "Build" section
2. Click "Select a build before you submit your app"
3. Select your uploaded build
4. Click "Done"
5. Answer Export Compliance questions:
   - Does your app use encryption? → **No** (unless you added custom encryption)
   - If No: Click "No" and proceed

#### 6. Submit for Review

1. Review all information
2. Click "Add for Review" (top right)
3. Click "Submit to App Review"
4. Confirm submission

#### 7. Wait for Review

**Timeline:**
- Initial submission: 24-48 hours (sometimes faster)
- Updates: Usually faster, 12-24 hours

**Possible Outcomes:**
- ✅ **Approved:** App goes live (or scheduled for manual release)
- ⚠️ **Metadata Rejected:** Fix listing issues, resubmit
- ❌ **Binary Rejected:** Fix app issues, upload new build, resubmit

**Common Rejection Reasons:**
- Missing privacy policy
- App crashes on launch
- Broken links or features
- Misleading screenshots
- Incomplete app information

**Check Status:**
- App Store Connect dashboard
- Email notifications
- Resolution Center (if rejected)

---

## Play Store Submission (Android)

### Prerequisites

- [ ] Google Play Developer account active
- [ ] `.aab` file ready (from EAS or Android Studio)
- [ ] Screenshots prepared
- [ ] Play Store listing content written
- [ ] Privacy Policy URL available

### Step-by-Step Process

#### 1. Create App in Play Console

1. Go to https://play.google.com/console
2. Sign in with Google account
3. Click "Create app"
4. Fill out form:
   - **App name:** Pure Bhakti Base
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:**
     - ✅ I have read and agree to the Google Play Developer Distribution Agreement
     - ✅ I acknowledge that this app complies with US export laws
5. Click "Create app"

#### 2. Set Up Your App

After creation, you'll see setup tasks:

##### Task 1: Set Up App

**App access:**
- All functionality is available without restrictions → Select this
- (Or if login required, provide test credentials)

**Ads:**
- Does your app contain ads? → No (unless you added ads)

**Content ratings:**
1. Click "Start questionnaire"
2. Enter email address
3. Select category: Reference, Education, Books (choose one)
4. Answer questions about content:
   - Violence? → No
   - Sexual content? → No
   - Profanity? → No
   - etc.
5. Get rating (likely "Everyone")
6. Click "Submit"

**Target audience:**
- Age groups: Select "18+" or "All ages" (your choice)
- Audience: General audience

**News app:**
- Is this a news app? → No

**COVID-19 contact tracing:**
- Does app support contact tracing? → No

**Data safety:**
1. Click "Start"
2. Data collection questions:
   - Does app collect or share data? → Select based on your analytics
   - Location? → No
   - Personal info? → No (unless you add user accounts)
   - Files/docs? → Yes (downloaded books)
   - App activity? → Only if analytics enabled
3. Data security:
   - Encrypted in transit? → Yes (HTTPS)
   - Provide way to request deletion? → N/A (no personal data)
4. Click "Submit"

**Government apps:**
- Is this a government app? → No

##### Task 2: Store Settings

**App category:**
- Category: Books & Reference
- Tags (optional): Spiritual, Religion, Reading

**Store listing contact details:**
- Email: [your support email]
- Phone (optional): [your phone]
- Website (optional): https://purebhaktibase.com

**External marketing (optional):**
- Leave unchecked unless you want Google to promote your app

#### 3. Main Store Listing

**App details:**

**App name:**
Pure Bhakti Base (max 50 characters)

**Short description:**
```
Read sacred Vaishnava literature offline. Thousands of pages available.
```
(max 80 characters)

**Full description:**
```
Pure Bhakti Base brings you a comprehensive library of sacred Vaishnava literature in English, Tamil, and other languages.

FEATURES:
• Browse thousands of pages of spiritual literature
• Download books for offline reading
• Beautiful, distraction-free reading experience
• Navigate with table of contents
• Jump to any page instantly
• Share passages with friends
• Search across all books
• Automatic content updates

CATEGORIES:
📚 English Books - Classic and contemporary Vaishnava literature
🕉️ Tamil Books - Sacred texts in Tamil language
✨ Rays of The Harmonist - Spiritual magazine archives

OFFLINE READING:
Download your favorite books and read them anywhere, anytime, even without internet connection. Manage your downloads and storage easily.

ABOUT PURE BHAKTI:
Pure Bhakti Base is the official mobile app of Pure Bhakti, dedicated to preserving and sharing authentic Vaishnava teachings.

SUPPORT:
Contact us at [your support email]
Privacy Policy: https://purebhaktibase.com/privacy
Terms of Service: https://purebhaktibase.com/terms
```
(max 4000 characters)

**App icon:**
- Upload 512 x 512 PNG (32-bit with alpha)
- Use your `assets/icon.png` resized to 512x512

**Feature graphic:**
- Size: 1024 x 500 pixels
- Required for featured placement
- **Tip:** Create a banner with app logo + tagline

**Screenshots:**

**Phone screenshots (required):**
- Upload 2-8 screenshots (1080 x 1920 minimum)
- JPEG or PNG
- Show key features

**7-inch tablet (optional but recommended):**
- Upload 2-8 screenshots
- Size: 1024 x 1920 minimum

**10-inch tablet (optional):**
- Upload 2-8 screenshots
- Size: 1600 x 2560 minimum

#### 4. Create Release

1. Left sidebar → "Release" → "Production"
2. Click "Create new release"

**Release details:**

**Release name:**
1.0.0 (or use version code: 1)

**Release notes:**
```
Initial release of Pure Bhakti Base mobile app.

Features:
• Browse library of sacred Vaishnava literature
• Download books for offline reading
• Full-page reader with smooth navigation
• Table of contents and page jumping
• Share book pages
• Search functionality
• Automatic content updates

Enjoy reading spiritual literature anytime, anywhere!
```
(max 500 characters)

#### 5. Upload AAB

**Method A: Using EAS (if you used eas submit)**
Already uploaded! Skip to step 6.

**Method B: Manual Upload**

1. In "App bundles" section, click "Upload"
2. Select your `.aab` file
3. Wait for upload and processing (2-5 minutes)
4. Google Play will process and show:
   - Supported devices
   - APK sizes
   - Android versions supported

**Warning checks:**
- Review any warnings (usually safe to proceed)
- Fix errors if any (must fix before proceeding)

#### 6. Review and Rollout

**Rollout options:**

**Option A: Full rollout (100%)**
- All users get update immediately
- **Recommended for initial release**

**Option B: Staged rollout**
- Start with 5%, 10%, 20%, 50%, then 100%
- Monitor for crashes/issues
- **Recommended for major updates later**

**For v1.0 initial release:** Select 100% (full rollout)

#### 7. Submit for Review

1. Click "Review release"
2. Review all information
3. Click "Start rollout to Production"
4. Confirm rollout

#### 8. Wait for Review

**Timeline:**
- Initial review: 2-6 hours (usually faster than iOS)
- Can be up to 7 days for first app
- Updates: Usually < 1 hour

**Possible Outcomes:**
- ✅ **Approved:** App goes live within hours
- ⚠️ **Rejected:** Fix issues and resubmit

**Common Rejection Reasons:**
- Missing privacy policy
- Broken features
- Misleading content
- Policy violations (spam, malware, copyright)

**Check Status:**
- Play Console dashboard
- Email notifications

---

## Post-Release Monitoring

### First 24 Hours

**Monitor:**
- [ ] Crash reports (App Store Connect / Play Console)
- [ ] User reviews (respond within 24 hours)
- [ ] Download numbers
- [ ] Server load (API performance)

**Where to check:**

**iOS:**
- App Store Connect → Analytics
- App Store Connect → Crashes
- App Store → Ratings & Reviews

**Android:**
- Play Console → Dashboard
- Play Console → Android vitals (crashes, ANRs)
- Play Console → Reviews

### First Week

**Track:**
- User adoption rate
- Average session time
- Crash-free rate (target: >99%)
- User retention (Day 1, Day 7)
- Feature usage (downloads, reader, search)

**Act on:**
- Critical crashes: Fix and release hotfix ASAP
- Common user complaints: Plan for next update
- Server performance issues: Optimize backend

### Ongoing

**Weekly:**
- Review new user feedback
- Monitor crash rates
- Check server performance

**Monthly:**
- Review analytics trends
- Plan feature updates
- Update content (add new books)

**Quarterly:**
- Renew SSL certificates (you're already doing this)
- Review app performance
- Consider major updates

---

## Troubleshooting

### Build Issues

#### "Build failed: Could not find module"

**Cause:** Missing dependency

**Fix:**
```bash
npm install
# or
npm install --legacy-peer-deps
```

#### "Code signing failed"

**Cause:** Missing or invalid signing certificate

**Fix (EAS):**
```bash
eas credentials
# Follow prompts to generate certificates
```

**Fix (Xcode):**
- Xcode → Preferences → Accounts
- Re-download certificates
- Try "Automatically manage signing"

#### "Android build failed: Execution failed for task ':app:bundleRelease'"

**Cause:** Various Gradle issues

**Fix:**
```bash
cd android
./gradlew clean
cd ..
npm start -- --clear
```

### Submission Issues

#### "Missing Compliance"

**iOS Export Compliance:**
- Answer: Does your app use encryption? → No (for standard HTTPS only)
- If you added custom encryption → Yes, then answer follow-up questions

#### "Missing Privacy Policy"

**Fix:**
Create a privacy policy page at https://purebhaktibase.com/privacy

**Minimum content:**
```
Privacy Policy for Pure Bhakti Base

Last updated: [Date]

Pure Bhakti Base respects your privacy. This app:
- Does not collect personal information
- Does not share data with third parties
- Uses HTTPS for secure communication
- Stores downloaded books locally on your device only

Downloaded books are stored only on your device and are not shared with any servers.

Contact: [your email]
```

#### "App Crashes on Launch"

**Debug:**
1. Test on physical device, not just simulator/emulator
2. Check for production environment issues
3. Review crash logs in App Store Connect / Play Console

**Common causes:**
- Missing production API keys
- Network connectivity required for first launch
- Asset loading issues

#### "Rejected for Metadata"

**Common issues:**
- Screenshots don't match app
- Description is misleading
- Keywords are spammy
- App name trademark issues

**Fix:** Update listing, wait for metadata review (usually < 24 hours)

### Common Questions

#### Q: How long until my app is live?

**A:**
- iOS: 24-48 hours after submission (sometimes faster)
- Android: 2-6 hours after submission (can be longer for first app)

#### Q: Can I update my app description after approval?

**A:**
- iOS: No, need to submit new version (or new metadata)
- Android: Yes, can update instantly without review

#### Q: What if I need to fix a critical bug quickly?

**A:**
1. Fix bug immediately
2. Increment version number (1.0.0 → 1.0.1)
3. Increment build number (1 → 2)
4. Build and submit
5. Request expedited review (iOS) if critical security issue
6. Usually live within 12-24 hours

#### Q: Can I remove my app from stores?

**A:**
- iOS: Yes, can remove from sale anytime (existing users keep it)
- Android: Yes, can unpublish anytime

#### Q: How do I handle user data if I add accounts later?

**A:**
- Update privacy policy BEFORE adding feature
- Update data safety forms in Play Console
- May trigger review in both stores

---

## Quick Start Command Reference

### Using EAS (Recommended for Beginners)

```bash
# One-time setup
npm install -g eas-cli
eas login
eas build:configure

# Build for both platforms
eas build --platform all --profile production

# Or build individually
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android

# Or submit both
eas submit --platform all
```

### Using Traditional Build Tools

```bash
# iOS (macOS only)
npx expo prebuild --platform ios
cd ios && pod install && cd ..
open ios/PureBhaktiBase.xcworkspace
# Then: Product → Archive in Xcode

# Android
npx expo prebuild --platform android
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Cost Summary

### One-Time Costs
- Google Play Developer: **$25** (one-time)

### Annual Costs
- Apple Developer Program: **$99/year**
- EAS (optional): **$0** (free tier) or **$99/month** (production plan)

### Total First Year
- **Minimum:** $124 (both stores, using free EAS tier)
- **With EAS Production:** $1,312 ($124 + $99/month × 12 months)

**Recommendation:** Start with free EAS tier, upgrade only if needed.

---

## Timeline Estimate

### Preparation (Before Building)
- Create developer accounts: **1-3 days** (approval wait times)
- Prepare assets (screenshots, descriptions): **2-4 hours**
- Create privacy policy page: **1 hour**
- Final testing: **2-4 hours**

**Total:** 3-5 days

### Building & Submission
- First iOS build (EAS): **15-20 minutes**
- First Android build (EAS): **15-20 minutes**
- Upload to App Store Connect: **10-15 minutes**
- Upload to Play Console: **10-15 minutes**
- Fill out store listings: **1-2 hours per store**

**Total:** 3-4 hours

### Review & Approval
- iOS review: **24-48 hours**
- Android review: **2-6 hours**

**Total:** 1-2 days

### Overall Timeline
**From start to both apps live:** 5-7 days (including wait times)

---

## Final Checklist Before First Release

### Developer Accounts
- [ ] Apple Developer account active ($99 paid)
- [ ] Google Play Developer account active ($25 paid)
- [ ] All agreements accepted

### Code & Assets
- [ ] App thoroughly tested
- [ ] Version set to 1.0.0
- [ ] Build numbers set to 1
- [ ] App icon created (1024x1024)
- [ ] Splash screen created
- [ ] Bundle ID / Package name configured
- [ ] No console errors

### Store Listings
- [ ] Privacy policy page created and live
- [ ] App description written
- [ ] Keywords selected (iOS)
- [ ] Screenshots captured (3-5 per platform)
- [ ] Feature graphic created (Android)
- [ ] Support email configured
- [ ] Category selected

### Builds
- [ ] iOS build created (.ipa)
- [ ] Android build created (.aab)
- [ ] Builds tested on physical devices
- [ ] Signing configured correctly

### Submissions
- [ ] iOS app created in App Store Connect
- [ ] Android app created in Play Console
- [ ] All store listing fields filled
- [ ] Builds uploaded
- [ ] Content ratings completed
- [ ] Data safety forms completed (Android)

### Ready to Submit!
- [ ] Final review of all information
- [ ] Submit to App Store
- [ ] Submit to Play Store
- [ ] Set calendar reminder to check status

---

## Support Resources

### Official Documentation
- **Expo EAS:** https://docs.expo.dev/eas/
- **Apple App Store:** https://developer.apple.com/app-store/
- **Google Play Console:** https://support.google.com/googleplay/android-developer/

### Helpful Tools
- **App Icon Generator:** https://www.appicon.co/
- **Screenshot Generator:** https://www.screely.com/
- **Privacy Policy Generator:** https://www.privacypolicies.com/

### Community
- **Expo Forums:** https://forums.expo.dev/
- **Stack Overflow:** Tag questions with `expo`, `react-native`
- **Reddit:** r/reactnative, r/expo

---

## Next Steps After Release

1. **Monitor:** Watch crash reports and reviews closely
2. **Respond:** Reply to user reviews within 24 hours
3. **Plan:** Start planning v1.1 with user feedback
4. **Update:** Release minor updates for bug fixes
5. **Grow:** Add new features based on user requests

---

## Document Version
Last Updated: January 2026
App Version: 1.0.0

---

**Good luck with your release! 🚀**

If you have questions during the process, refer to this guide and the official platform documentation.
