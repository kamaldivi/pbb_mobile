export const colors = {
  // Primary Colors
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#3B82F6',

  // Secondary Colors
  secondary: '#06B6D4',
  secondaryDark: '#0891B2',
  secondaryLight: '#22D3EE',

  // Accent Colors
  accent: '#7C3AED',
  accentLight: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB', // Darker for better contrast (was #F9FAFB)
    tertiary: '#D1D5DB', // Darker for better contrast (was #F3F4F6)
    dark: '#111827',
  },

  // Gradient Colors
  gradient: {
    blue: ['#EFF6FF', '#DBEAFE'],
    cyan: ['#ECFEFF', '#CFFAFE'],
    violet: ['#F5F3FF', '#EDE9FE'],
    slate: ['#F8FAFC', '#F1F5F9'],
  },

  // Border Colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // BookmarkColors
  bookmark: {
    active: '#F59E0B',
    inactive: '#9CA3AF',
  },
};

export type Colors = typeof colors;
