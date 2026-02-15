# Pure Bhakti Base Mobile App

A React Native mobile application for accessing and reading the divine teachings of Yugācārya Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja.

## Features

### Library Management
- **Three Categories**: English books, Tamil books, and Rays of the Harmonist magazines
- **Organized Collections**: Books are grouped by publisher (Gurudev's books and Gokul Bhajan books)
- **Search Functionality**: Search book titles across all categories
- **Book Details**: View comprehensive book information including description, language, page count, and publication date

### Reading Experience
- **Full-Page Reader**: Immersive reading experience with full-screen book pages
- **Table of Contents**: Quick navigation to any chapter or section
- **Core Pages**: Direct access to important pages (title page, copyright, dedication, etc.)
- **Page Navigation**: Swipe or use buttons to navigate between pages
- **Jump to Page**: Quickly navigate to any specific page number

### Offline Capabilities
- **Download Books**: Download entire books for offline reading
- **Storage Management**: View downloaded books and manage device storage
- **Offline Indicator**: Clear indication when device is offline
- **Downloaded Badge**: Visual indicator on book cards showing which books are available offline
- **Background Downloads**: Continue using the app while books download

### User Interface
- **Navigation Drawer**: Easy access to Library, Downloads, and About screens
- **Responsive Design**: Optimized for various screen sizes
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Graceful error messages with retry options

## Tech Stack

### Core Technologies
- **React Native**: 0.81.5
- **Expo**: ~54.0.31
- **TypeScript**: ^5.9.3
- **React**: 19.1.0

### Key Dependencies
- **State Management**: Zustand (^5.0.9)
- **Data Fetching**: @tanstack/react-query (^5.90.16)
- **Navigation**: @react-navigation/native (^7.1.26)
- **HTTP Client**: axios (^1.13.2)
- **Offline Detection**: @react-native-community/netinfo (11.4.1)

### Expo Modules
- **expo-file-system**: File storage for offline books
- **expo-image**: Optimized image rendering
- **expo-splash-screen**: Custom splash screen
- **expo-sharing**: Share book pages
- **expo-haptics**: Haptic feedback

## Project Structure

```
pbb_mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── library/         # Library-specific components
│   │   ├── reader/          # Reader-specific components
│   │   ├── AppLoadingScreen.tsx
│   │   └── NavigationDrawer.tsx
│   ├── config/              # Configuration files
│   │   └── api.config.ts    # API endpoints and image URLs
│   ├── hooks/               # Custom React hooks
│   │   └── useNetworkStatus.ts
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/             # Main app screens
│   │   ├── AboutScreen.tsx
│   │   ├── DownloadsScreen.tsx
│   │   ├── LibraryScreen.tsx
│   │   └── ReaderScreen.tsx
│   ├── services/            # Business logic and API
│   │   ├── api/             # API client and hooks
│   │   └── offline/         # Offline manager
│   ├── stores/              # Zustand state stores
│   │   ├── libraryStore.ts
│   │   └── offlineStore.ts
│   ├── theme/               # Theme and styling
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── offline.ts
│   └── utils/               # Utility functions
│       └── bookCategories.ts
├── assets/                  # Images, icons, and fonts
├── docs/                    # Documentation
│   └── SECURITY.md         # Security guidelines
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pbb_mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on a specific platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Configuration

API endpoints are configured in `app.json` under the `extra` section:

```json
{
  "extra": {
    "apiBaseUrl": "https://purebhaktibase.com:8443",
    "imageBaseUrl": "https://purebhaktibase.com"
  }
}
```

## Development

### TypeScript
The project uses strict TypeScript mode. All components and utilities are fully typed.

### Code Organization
- **Components**: Reusable UI components with clear props interfaces
- **Screens**: Top-level screen components
- **Services**: Business logic separated from UI
- **Stores**: Global state management using Zustand
- **Types**: Centralized type definitions

### Path Aliases
The project uses TypeScript path aliases for cleaner imports:
- `@/` → `src/`
- `@components/` → `src/components/`
- `@screens/` → `src/screens/`
- `@services/` → `src/services/`
- `@hooks/` → `src/hooks/`
- `@stores/` → `src/stores/`
- `@types/` → `src/types/`
- `@utils/` → `src/utils/`
- `@config/` → `src/config/`
- `@theme/` → `src/theme/`

## Building for Production

### iOS
```bash
expo build:ios
```

Requirements:
- Apple Developer account
- Valid provisioning profile
- App Store Connect setup

### Android
```bash
expo build:android
```

Requirements:
- Google Play Console account
- Keystore for signing
- App bundle configuration

## Security

This app implements several security best practices:
- All network communication over HTTPS
- No collection of personal data
- Minimal permissions requested
- Secure local file storage
- No third-party tracking

See [docs/SECURITY.md](docs/SECURITY.md) for detailed security information.

## Offline Mode

The app supports full offline functionality:

1. **Downloading Books**: Tap "Download Book" in the book details modal
2. **Storage Management**: View all downloaded books in the Downloads screen
3. **Automatic Offline Detection**: App detects network status and loads from local storage when offline
4. **Storage Estimates**: See estimated download size before downloading
5. **Manual Deletion**: Delete books individually or all at once to free up space

Downloaded books include:
- All book pages (WebP images)
- Table of Contents
- Core page information
- Book metadata

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Use functional components with hooks
- Keep components small and focused

### Commit Messages
- Use clear, descriptive commit messages
- Reference issue numbers when applicable

## License & Copyright

### Book and Magazine Content
© Gaudiya Vedanta Publications
Licensed under CC BY-ND 3.0

For permissions and licensing:
- Website: https://purebhakti.com/pluslicense
- Email: gvp.contactus@gmail.com

### Software and Gokul Bhajan Book Content
© Gokul Bhajan Gaudiya Matha

## About

**Vision**: To preserve, organize, and make accessible the divine teachings of Yugācārya Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja, inspiring and uplifting seekers on the sacred path of pure bhakti.

**Mission**: To serve as a spiritual companion for devotees by offering intelligent and intuitive access to Śrīla Gurudev's books and insights, enabling personalized, immersive, and multilingual learning experiences rooted in the authentic Gaudiya Vaiṣṇava tradition.

## Support

For issues, questions, or feature requests, please contact the development team.

## Version

Current Version: 1.0.0

---

Built with devotion for the service of pure bhakti.
