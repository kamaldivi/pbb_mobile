# Where to Add Release Notes - Step-by-Step Guide

## Overview
Release notes are added in the **app store consoles** (not in your code). You add them during the app submission/update process.

---

## Apple App Store (iOS)

### Where: App Store Connect

**URL:** https://appstoreconnect.apple.com

### Step-by-Step Process:

#### 1. **Login to App Store Connect**
- Go to https://appstoreconnect.apple.com
- Sign in with your Apple Developer account

#### 2. **Navigate to Your App**
- Click "My Apps"
- Select "Pure Bhakti Base"

#### 3. **Create New Version**
- Click the "+" button next to "iOS App"
- Select "Create New Version"
- Enter version number (e.g., `1.1.0`)

#### 4. **Add Release Notes** ⭐
Location: **"What's New in This Version"** section

**Character Limit:** 4,000 characters

**Example:**
```
Version 1.1.0

New Features:
• Download books for offline reading - Read your favorite books without internet connection
• Storage management - View downloaded books and free up space when needed
• Offline mode indicator - Clear indication when you're reading offline

Improvements:
• Faster book page loading
• Enhanced reader navigation
• Improved search functionality

Bug Fixes:
• Fixed issue with page navigation in some books
• Resolved download progress display
• Enhanced app stability

Security & Privacy:
• Updated security measures for better data protection
• Performance optimizations

We recommend updating to get the latest features and improvements.
```

#### 5. **Upload Build**
- Upload your IPA file (from `expo build:ios`)
- Select the build for this version

#### 6. **Fill Other Required Info**
- Screenshots (if new features)
- App description (if changed)
- Keywords (if changed)
- Support URL
- Privacy policy (if changed)

#### 7. **Submit for Review**
- Click "Submit for Review"
- Answer app review questions
- Wait for approval (usually 24-48 hours)

### Editing Release Notes After Submission

**Before Approval:**
- You can edit release notes anytime before approval
- Go to your version → Edit "What's New in This Version"

**After Approval (App is Live):**
- Cannot edit existing version's notes
- Must submit a new version to change notes
- Users will see the notes from when the version was submitted

---

## Google Play Store (Android)

### Where: Google Play Console

**URL:** https://play.google.com/console

### Step-by-Step Process:

#### 1. **Login to Play Console**
- Go to https://play.google.com/console
- Sign in with your Google Play Developer account

#### 2. **Select Your App**
- Click on "Pure Bhakti Base"

#### 3. **Navigate to Release**
- Left sidebar → "Release" → "Production"
- (Or "Internal testing" / "Closed testing" / "Open testing" if doing staged release)

#### 4. **Create New Release**
- Click "Create new release"

#### 5. **Upload App Bundle**
- Upload your AAB file (from `expo build:android`)
- Or drag and drop the file

#### 6. **Add Release Notes** ⭐

**Location:** "Release notes" section (scrollable language tabs)

**Important:** Google requires release notes **per language**

##### For English (en-US):

**Character Limit:** 500 characters (much shorter than iOS!)

**Example:**
```
Version 1.1.0

✨ New Features:
• Offline book downloads
• Storage management
• Offline mode indicator

⚡ Improvements:
• Faster page loading
• Better navigation
• Enhanced search

🔒 Security updates and bug fixes

Update now for the best experience!
```

##### For Other Languages (if supporting):
- Click language tabs (Tamil, Hindi, etc.)
- Add translated release notes
- Or use same English notes for all

#### 7. **Review Release**
- Review all changes
- Click "Review release"

#### 8. **Rollout Percentage (Optional)**
- Choose rollout percentage
  - 100% = All users get update immediately
  - 10% = Only 10% get update (staged rollout)
- Recommended for major updates: Start at 10-20%, increase gradually

#### 9. **Start Rollout**
- Click "Start rollout to Production"
- Confirm

#### 10. **Review Time**
- Usually 2-6 hours
- Can be faster than iOS

### Editing Release Notes After Submission

**Before Approval:**
- Cannot edit once submitted
- Must create new release to change

**After Approval (During Rollout):**
- Can update release notes for same version
- Go to Production → Active release → "Edit release notes"
- Changes apply to users who haven't updated yet

**After 100% Rollout:**
- Notes are locked for that version
- Must create new version to add new notes

---

## Optional: Keep Local Copy in Your Repo

While release notes are added in app store consoles, it's good practice to keep a local copy for reference.

### Create Release Notes File

**File:** `/CHANGELOG.md` or `/RELEASE_NOTES.md`

**Example Structure:**

```markdown
# Release Notes - Pure Bhakti Base Mobile

## Version 1.1.0 (March 2026)

### New Features
- **Offline Downloads**: Download books for reading without internet
- **Storage Management**: View and manage downloaded books
- **Offline Indicator**: Clear indication when device is offline

### Improvements
- Faster book page loading (30% improvement)
- Enhanced reader navigation with smoother transitions
- Improved search functionality across all categories

### Bug Fixes
- Fixed page navigation issue in some books
- Resolved download progress display accuracy
- Enhanced overall app stability

### Security
- Updated security measures for data protection
- Performance optimizations

### Technical
- Added orphan cleanup for outdated downloaded books
- Implemented gradual reminder system for storage management
- Enhanced offline mode detection

---

## Version 1.0.0 (January 2026)

### Initial Release
- Browse library of books in English, Tamil, and Rays categories
- Read books with full-page reader
- Table of contents navigation
- Jump to specific pages
- Share book pages
- Search book titles
- View book details and metadata
```

### Benefits of Local Copy:
- ✅ Version history in one place
- ✅ Easy to copy-paste to app stores
- ✅ Team can review before submission
- ✅ Track what changed when
- ✅ Reference for future updates

---

## Release Notes Best Practices

### ✅ DO:

**1. Be User-Friendly**
```
Good: "Download books for offline reading"
Bad:  "Implemented offline storage mechanism with progressive download"
```

**2. Focus on Benefits**
```
Good: "Faster page loading - books open 30% quicker"
Bad:  "Optimized image caching algorithm"
```

**3. Organize by Category**
```
✨ New Features
⚡ Improvements
🐛 Bug Fixes
🔒 Security
```

**4. Highlight Security**
```
Good: "This update includes important security improvements. We recommend updating as soon as possible."
Bad:  "Security patches"
```

**5. Be Specific**
```
Good: "Fixed issue where page numbers didn't update when swiping"
Bad:  "Bug fixes"
```

**6. Use Active Voice**
```
Good: "Download books for offline reading"
Bad:  "Books can now be downloaded"
```

### ❌ DON'T:

**1. Use Technical Jargon**
```
Bad: "Refactored OfflineManager singleton with AsyncStorage integration"
Good: "Improved download reliability"
```

**2. Be Vague**
```
Bad: "Bug fixes and performance improvements"
Good: "Fixed 3 issues reported by users, including search crash and page loading"
```

**3. Write Too Much (Android)**
```
Bad: 600 characters (exceeds 500 limit)
Good: 450 characters with key highlights
```

**4. Forget Security Mentions**
```
Bad: (No mention of security fix)
Good: "🔒 Important security update included"
```

**5. Use Marketing Speak**
```
Bad: "The most amazing, revolutionary update ever!"
Good: "Major update with offline downloads and improved performance"
```

---

## Templates for Different Update Types

### Critical Security Update

**iOS (App Store Connect):**
```
Version 1.0.1 - Critical Security Update

🔒 SECURITY UPDATE
This update fixes an important security issue. Please update immediately.

What's Fixed:
• Resolved security vulnerability in data transmission
• Enhanced encryption for downloaded content
• Improved authentication security

We strongly recommend updating as soon as possible for your protection.
```

**Android (Play Console):**
```
Version 1.0.1

🔒 CRITICAL SECURITY UPDATE
Please update immediately.

Fixed:
• Security vulnerability
• Enhanced encryption
• Improved authentication

Update now for your protection.
```

### Major Feature Release

**iOS:**
```
Version 1.1.0 - Offline Reading

✨ NEW: Download Books for Offline Reading
Now you can download your favorite books and read them without an internet connection!

New Features:
• Download entire books to your device
• Manage downloaded books and storage
• Read offline with full functionality
• Automatic cleanup of outdated downloads

Improvements:
• 30% faster page loading
• Smoother navigation
• Enhanced search

Bug Fixes:
• Fixed page navigation in some books
• Resolved occasional crashes
• Improved stability

Update now to enjoy offline reading!
```

**Android:**
```
Version 1.1.0

✨ NEW: Offline Downloads!
Download books and read without internet.

• Download entire books
• Manage storage
• Faster page loading
• Better navigation
• Bug fixes & stability

Update now!
```

### Minor Bug Fix

**iOS:**
```
Version 1.0.1

Bug Fixes:
• Fixed issue where some book covers didn't load
• Resolved crash when searching in Tamil category
• Corrected page numbers in table of contents

Performance:
• Improved app startup time
• Reduced memory usage

Thank you for using Pure Bhakti Base!
```

**Android:**
```
Version 1.0.1

Bug fixes:
• Fixed book cover loading
• Resolved search crash
• Corrected page numbers
• Improved performance

Thanks for using the app!
```

---

## Character Limits Summary

| Platform | Limit | Recommendation |
|----------|-------|----------------|
| iOS App Store | 4,000 chars | Use 500-1,000 for readability |
| Google Play | 500 chars | Use all of it, be concise |
| In-app prompt | ~200 chars | Very brief highlight |

---

## After Publishing

### Monitor Feedback

**App Store Connect:**
- Check "Ratings and Reviews" section
- Respond to user feedback
- Look for common complaints about update

**Google Play Console:**
- Check "Reviews" section
- Use filters to see reviews mentioning version
- Set up email alerts for new reviews

### Track Adoption

**Both Stores:**
- Monitor version distribution
- Check crash reports for new version
- Watch for spike in support requests

**Example Monitoring:**
```
Day 1: 10% adoption (early adopters)
Day 3: 30% adoption
Week 1: 50% adoption
Week 2: 70% adoption
Month 1: 90% adoption
```

If adoption is slow:
- Improve release notes
- Add in-app update prompt
- Consider staged rollout issues

---

## Quick Reference Card

### iOS Release Notes
📍 **Where:** App Store Connect → My Apps → Your App → Version → "What's New in This Version"
📏 **Limit:** 4,000 characters
⏱️ **When:** During version submission
✏️ **Edit:** Before approval only

### Android Release Notes
📍 **Where:** Play Console → Release → Production → Create Release → "Release notes"
📏 **Limit:** 500 characters (per language)
⏱️ **When:** During AAB upload
✏️ **Edit:** Before and during rollout

### Local Copy (Optional)
📍 **Where:** `/CHANGELOG.md` in your repo
📏 **Limit:** None (for reference)
⏱️ **When:** Before creating app store releases
✏️ **Edit:** Anytime

---

## Next Steps

1. ✅ Create `/CHANGELOG.md` in your repo (optional but recommended)
2. ✅ Draft release notes for v1.0.0
3. ✅ Save the templates above for future releases
4. ✅ When ready to release, copy-paste to app stores during submission

---

## Related Documentation
- [APP_VERSION_UPDATES.md](APP_VERSION_UPDATES.md) - Version update strategy
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) - Pre-release testing

## Last Updated
January 2026
