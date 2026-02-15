# App Version Updates & User Communication Strategy

## Question
"How to communicate users when newer versions of this app is released or any security vulnerabilities are fixed?"

---

## Overview

Unlike web apps that update automatically, mobile apps require users to manually update through app stores. This document outlines strategies for notifying users about updates and managing version rollouts.

---

## Communication Channels

### 1. App Store Release Notes (Primary) ⭐

**Platform**: Apple App Store & Google Play Store

**How It Works:**
- Users see release notes when checking for updates
- Visible on app store page
- Shown during update prompts

**Best Practices:**

#### Good Release Notes Example:
```
Version 1.1.0 - January 15, 2026

What's New:
• Added offline book downloads for reading without internet
• Improved book loading performance
• Fixed issue with page navigation in reader
• Enhanced security and stability

Security Note:
This update includes important security improvements.
We recommend updating as soon as possible.
```

#### Poor Release Notes Example ❌:
```
Version 1.1.0
Bug fixes and improvements
```

**Why App Store Notes Matter:**
- ✅ Users check these before updating
- ✅ Builds trust and transparency
- ✅ Highlights value of updating
- ✅ Required by app stores

---

### 2. In-App Update Prompts (Recommended) ⭐⭐

**Concept**: Show dialog prompting users to update when new version is available.

**Implementation Strategy:**

#### Option A: Backend-Controlled (Recommended)

Create a simple API endpoint that returns current app version info:

```json
// GET https://purebhaktibase.com:8443/api/app-version
{
  "currentVersion": "1.1.0",
  "minimumVersion": "1.0.0",
  "updateRequired": false,
  "updateRecommended": true,
  "releaseNotes": "New offline download feature available!",
  "downloadUrl": {
    "ios": "https://apps.apple.com/app/pure-bhakti-base/id...",
    "android": "https://play.google.com/store/apps/details?id=com.purebhaktibase.mobile"
  }
}
```

**Mobile App Logic:**
```typescript
// src/services/version/VersionChecker.ts
import { Platform, Linking, Alert } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';
import Constants from 'expo-constants';

interface VersionInfo {
  currentVersion: string;
  minimumVersion: string;
  updateRequired: boolean;
  updateRecommended: boolean;
  releaseNotes: string;
  downloadUrl: {
    ios: string;
    android: string;
  };
}

export class VersionChecker {
  private static readonly APP_VERSION = Constants.expoConfig?.version || '1.0.0';

  /**
   * Check if app update is available
   */
  static async checkForUpdates(): Promise<void> {
    try {
      const response = await axios.get<VersionInfo>(
        `${API_CONFIG.baseURL}/api/app-version`
      );

      const versionInfo = response.data;
      const needsUpdate = this.compareVersions(
        this.APP_VERSION,
        versionInfo.currentVersion
      );

      if (needsUpdate) {
        if (versionInfo.updateRequired) {
          // Force update - user cannot dismiss
          this.showForceUpdateDialog(versionInfo);
        } else if (versionInfo.updateRecommended) {
          // Optional update - user can dismiss
          this.showOptionalUpdateDialog(versionInfo);
        }
      }
    } catch (error) {
      // Silently fail - don't block app if version check fails
      console.error('Version check failed:', error);
    }
  }

  /**
   * Show force update dialog (cannot dismiss)
   */
  private static showForceUpdateDialog(versionInfo: VersionInfo): void {
    Alert.alert(
      'Update Required',
      `A critical update is available. Please update to continue using the app.\n\n${versionInfo.releaseNotes}`,
      [
        {
          text: 'Update Now',
          onPress: () => this.openAppStore(versionInfo),
        },
      ],
      { cancelable: false } // Cannot dismiss
    );
  }

  /**
   * Show optional update dialog (can dismiss)
   */
  private static showOptionalUpdateDialog(versionInfo: VersionInfo): void {
    Alert.alert(
      'Update Available',
      `Version ${versionInfo.currentVersion} is now available.\n\n${versionInfo.releaseNotes}`,
      [
        {
          text: 'Later',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: () => this.openAppStore(versionInfo),
        },
      ]
    );
  }

  /**
   * Open app store for update
   */
  private static openAppStore(versionInfo: VersionInfo): void {
    const url = Platform.OS === 'ios'
      ? versionInfo.downloadUrl.ios
      : versionInfo.downloadUrl.android;

    Linking.openURL(url);
  }

  /**
   * Compare version strings (e.g., "1.0.0" vs "1.1.0")
   */
  private static compareVersions(current: string, latest: string): boolean {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (latestParts[i] > currentParts[i]) return true;
      if (latestParts[i] < currentParts[i]) return false;
    }

    return false; // Versions are equal
  }
}
```

**Usage in App:**
```typescript
// In App.tsx or LibraryScreen.tsx
useEffect(() => {
  // Check for updates on app launch
  VersionChecker.checkForUpdates();
}, []);
```

**Benefits:**
- ✅ Control messaging from backend
- ✅ Can force critical security updates
- ✅ Update messaging without app update
- ✅ Track update adoption

**Drawbacks:**
- Requires backend API endpoint
- Slightly more complex

#### Option B: Hardcoded Check (Simpler)

Check against hardcoded version in app:

```typescript
const LATEST_VERSION = '1.1.0';
const MINIMUM_VERSION = '1.0.0';

if (currentVersion < MINIMUM_VERSION) {
  // Show force update
}
```

**Drawbacks:**
- ❌ Cannot update messaging remotely
- ❌ Requires app update to change version check logic

---

### 3. Push Notifications (Optional)

**Platform**: Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNS)

**Use Cases:**
- Critical security updates
- Major feature releases
- Time-sensitive announcements

**Example:**
```
🔔 Update Available
Pure Bhakti Base v1.2.0 is now available with
offline downloads and improved performance.
Tap to update.
```

**Implementation Complexity:**
- Moderate (requires Firebase/APNS setup)
- Requires user opt-in for notifications
- Additional maintenance

**Recommendation:**
- 📋 **Not needed for v1.0** - use in-app prompts first
- 🔮 **Consider for future** if you need urgent communication

---

### 4. Website & Social Media (Supplementary)

**Platforms:**
- Website: purebhakti.com
- Social media (if applicable)
- Email newsletter (if applicable)

**Example Post:**
```
📱 Pure Bhakti Base Mobile App Update

Version 1.1.0 is now available!

New Features:
✨ Download books for offline reading
⚡ Faster page loading
🔒 Enhanced security

Update now: [App Store Link] [Play Store Link]
```

**Benefits:**
- Reaches users before they open app
- Good for major releases
- Builds community awareness

---

## Update Strategies by Severity

### 🔴 Critical Security Update (Force Update)

**Scenario:** Security vulnerability discovered that could harm users

**Response:**
1. **Immediate**: Release patched version to app stores
2. **Backend**: Set `updateRequired: true` in version API
3. **App**: Shows non-dismissible update dialog
4. **Communication**:
   - App store release notes emphasize security
   - Post on website/social media
   - Consider email if you have user contacts

**Example Dialog:**
```
Critical Security Update Required

For your security, please update to the latest
version immediately. The app cannot be used
until you update.

[Update Now] (cannot dismiss)
```

**Timeline:**
- Day 0: Discover vulnerability
- Day 0-1: Develop and test fix
- Day 1: Submit to app stores
- Day 2-3: App store review (iOS ~24hrs, Android ~6hrs)
- Day 3: Release approved, enable force update
- Week 1-2: Monitor adoption, follow up with users

---

### 🟡 Important Update (Recommended)

**Scenario:** Bug fixes, performance improvements, minor features

**Response:**
1. **Release**: Submit update to app stores
2. **Backend**: Set `updateRecommended: true`
3. **App**: Shows dismissible update dialog
4. **Communication**: App store release notes

**Example Dialog:**
```
Update Available

Version 1.1.0 includes new features and
improvements:
• Offline book downloads
• Faster loading times
• Bug fixes

[Later]  [Update]
```

**Timeline:**
- User can dismiss and update later
- Gentle reminder on next app launch
- No forced update

---

### 🟢 Optional Update (Informational)

**Scenario:** Minor tweaks, cosmetic changes

**Response:**
1. **Release**: Submit to app stores
2. **Communication**: App store release notes only
3. **No in-app prompts**: Users discover naturally

**Example:**
```
Version 1.0.1

• Minor UI improvements
• Performance optimizations
```

---

## Version Numbering Strategy

### Semantic Versioning (Recommended)

Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

**MAJOR** (1.x.x):
- Breaking changes
- Major new features
- Complete redesigns
- Example: `1.0.0` → `2.0.0`

**MINOR** (x.1.x):
- New features (backward compatible)
- Significant improvements
- Example: `1.0.0` → `1.1.0`

**PATCH** (x.x.1):
- Bug fixes
- Minor tweaks
- Security patches
- Example: `1.0.0` → `1.0.1`

### Your Version History Example:

```
v1.0.0 (Jan 2026) - Initial release
├── Library browsing
├── Book reader
└── Basic features

v1.1.0 (Mar 2026) - Offline downloads
├── Download books
├── Offline reading
└── Storage management

v1.1.1 (Apr 2026) - Bug fixes
├── Fix download error
└── Improve performance

v2.0.0 (Jul 2026) - Major update
├── User accounts
├── Bookmarks and notes
└── Redesigned UI
```

---

## Implementation Recommendation

### Phase 1: v1.0 Release (Current)
**Use:**
- ✅ App Store release notes (clear and detailed)
- ✅ Simple version display in About screen

**Skip:**
- ⏭️ In-app update prompts (add in v1.1)
- ⏭️ Push notifications (future consideration)

### Phase 2: v1.1+ (Future)
**Add:**
- ✅ Backend version check API
- ✅ In-app update prompts
- ✅ Force update capability (for critical security)

**Implementation:**
1. Create version API endpoint (15 min)
2. Add VersionChecker service (30 min)
3. Integrate in App.tsx (10 min)
4. Test with staging version (15 min)

**Total effort:** ~1-2 hours

---

## App Store Submission Process

### Apple App Store

**Review Time:** 24-48 hours (usually)

**Steps:**
1. Build app: `expo build:ios`
2. Upload to App Store Connect
3. Fill out release notes
4. Submit for review
5. Wait for approval
6. Release to users

**Expedited Review:**
Available for critical issues (security, major bugs)

### Google Play Store

**Review Time:** 2-6 hours (usually)

**Steps:**
1. Build app: `expo build:android`
2. Upload to Play Console
3. Fill out release notes
4. Submit for review
5. Automatic release or staged rollout

**Staged Rollout:**
- Release to 10% of users first
- Monitor for crashes/issues
- Gradually increase to 100%

---

## Monitoring Update Adoption

### Track Version Distribution

**Tools:**
- Google Analytics for Firebase
- Expo Analytics (if using EAS)
- Custom analytics

**What to Track:**
- % of users on latest version
- % of users on minimum version
- Version distribution by platform

**Example Dashboard:**
```
Current Version Distribution:
v1.1.0: 75% ✅ (target: 90% within 2 weeks)
v1.0.0: 20%
v0.9.x: 5%  ⚠️ (encourage upgrade)
```

**Actions Based on Data:**
- Low adoption → Improve release notes, add in-app prompt
- Critical version still in use → Consider force update
- Platform differences → Platform-specific messaging

---

## Security Vulnerability Response Plan

### Preparation

**1. Have a Process:**
```
Discover → Assess → Fix → Test → Release → Communicate → Monitor
```

**2. Emergency Contacts:**
- Development team
- App store contacts
- Communication team

**3. Testing Environment:**
- Staging app for testing fixes
- Test user accounts
- Security testing tools

### Response Timeline

**Critical Vulnerability:**
- Hour 0: Discover vulnerability
- Hour 1-4: Develop and test fix
- Hour 4-6: Submit to app stores
- Hour 6: Request expedited review (if available)
- Hour 24-48: Release approved
- Hour 48: Enable force update
- Day 3-7: Monitor adoption
- Day 7+: Follow up with remaining users

**Non-Critical Vulnerability:**
- Day 0: Discover and assess
- Day 1-2: Develop and test fix
- Day 3: Submit to app stores
- Day 4-5: Standard review
- Day 5: Release with recommended update
- Week 1-2: Monitor adoption

### Communication Templates

**Critical Security Issue:**
```
App Store Release Notes:
---
🔒 CRITICAL SECURITY UPDATE

This update fixes a security vulnerability that could
affect your data. Please update immediately.

What's Fixed:
• Resolved security issue in data transmission
• Enhanced encryption
• Improved authentication

We recommend updating as soon as possible.
```

**Important Security Fix:**
```
App Store Release Notes:
---
Version 1.0.1 - Security Update

This update includes important security improvements
and bug fixes.

Updates:
• Enhanced security measures
• Fixed login issue
• Performance improvements

Please update to ensure the best experience.
```

---

## Best Practices

### DO:
✅ Write clear, user-friendly release notes
✅ Highlight security updates prominently
✅ Test thoroughly before release
✅ Use semantic versioning
✅ Monitor update adoption
✅ Have force update capability for critical issues
✅ Be transparent about what changed

### DON'T:
❌ Use vague release notes ("bug fixes")
❌ Release untested security patches
❌ Force update for minor features
❌ Ignore low adoption rates
❌ Skip communication for security fixes
❌ Use technical jargon in user-facing messages

---

## Recommended Implementation for v1.1

### Step 1: Create Version API Endpoint (Backend)

```python
# Backend API (FastAPI example)
@app.get("/api/app-version")
async def get_app_version():
    return {
        "currentVersion": "1.1.0",
        "minimumVersion": "1.0.0",
        "updateRequired": False,
        "updateRecommended": True,
        "releaseNotes": "New offline download feature available!",
        "downloadUrl": {
            "ios": "https://apps.apple.com/app/...",
            "android": "https://play.google.com/store/apps/..."
        }
    }
```

### Step 2: Add VersionChecker Service (Mobile)

See implementation code above in "Option A: Backend-Controlled"

### Step 3: Integrate in App

```typescript
// App.tsx
useEffect(() => {
  const checkVersion = async () => {
    await VersionChecker.checkForUpdates();
  };

  checkVersion();
}, []);
```

### Step 4: Test

1. Set `updateRecommended: true` → Test optional update
2. Set `updateRequired: true` → Test force update
3. Test with different version numbers
4. Test "Update Now" button opens app store

---

## Quick Reference

### How to Notify Users of Updates?

**v1.0 (Now):**
- App Store release notes

**v1.1+ (Recommended):**
- App Store release notes
- In-app update prompts (optional/forced)
- Backend-controlled messaging

### How to Handle Security Updates?

**Critical:**
- Force update (non-dismissible dialog)
- Expedited app store review
- Clear communication in release notes

**Important:**
- Recommended update (dismissible dialog)
- Standard app store review
- Mention security in release notes

### How Long Until Users Update?

**Typical Adoption:**
- Week 1: 40-60% of active users
- Week 2: 60-80% of active users
- Month 1: 80-95% of active users

**With Force Update:**
- Week 1: 90-100% of active users

---

## Summary

### Recommended Strategy

1. **v1.0 Release**: Use app store release notes only
2. **v1.1+**: Add backend version check + in-app prompts
3. **Critical Security**: Force update capability
4. **Regular Updates**: Optional update prompts

### Key Takeaways

- ✅ Clear app store release notes are essential
- ✅ In-app prompts significantly improve adoption
- ✅ Backend control allows flexible messaging
- ✅ Force updates should be rare (security only)
- ✅ Monitor adoption and adjust strategy

### Effort Required

**Minimal (v1.0):**
- Good release notes: 10 min per release

**Recommended (v1.1+):**
- Backend API: 30 min one-time
- Mobile integration: 1 hour one-time
- Maintenance: 5 min per release

---

## Related Documentation
- [SECURITY.md](SECURITY.md) - Security guidelines
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) - Pre-release checklist

## Last Updated
January 2026
