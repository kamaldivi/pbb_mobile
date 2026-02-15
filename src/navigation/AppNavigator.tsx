import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { linking } from './linking';

// Screens
import LibraryScreen from '@/screens/LibraryScreen';
import ReaderScreen from '@/screens/ReaderScreen';
import { DownloadsScreen } from '@/screens/DownloadsScreen';
import BookmarksScreen from '@/screens/BookmarksScreen';
import AboutScreen from '@/screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Library"
          component={LibraryScreen}
        />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Downloads"
          component={DownloadsScreen}
        />
        <Stack.Screen
          name="Bookmarks"
          component={BookmarksScreen}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
