import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Library: undefined;
  Reader: {
    bookId: number;
    page?: number;
  };
  Downloads: undefined;
  Bookmarks: undefined;
  About: undefined;
};

export type LibraryScreenProps = NativeStackScreenProps<RootStackParamList, 'Library'>;
export type ReaderScreenProps = NativeStackScreenProps<RootStackParamList, 'Reader'>;
export type DownloadsScreenProps = NativeStackScreenProps<RootStackParamList, 'Downloads'>;
export type BookmarksScreenProps = NativeStackScreenProps<RootStackParamList, 'Bookmarks'>;
export type AboutScreenProps = NativeStackScreenProps<RootStackParamList, 'About'>;
