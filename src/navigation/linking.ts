import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import type { RootStackParamList } from '@/types/navigation';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'purebhaktibase://'],
  config: {
    screens: {
      Library: '',
      Reader: {
        path: 'reader/:bookId',
        parse: {
          bookId: Number,
          page: Number,
        },
      },
    },
  },
};
