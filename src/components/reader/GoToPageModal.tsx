import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CorePageInfo } from '@/types/api';
import { colors, spacing, typography, borderRadius } from '@/theme';

interface GoToPageModalProps {
  visible: boolean;
  currentPage: number;
  currentPageLabel: string | null;
  totalPages: number;
  pagesList: CorePageInfo[];
  onNavigate: (page: number) => void;
  onClose: () => void;
}

export const GoToPageModal: React.FC<GoToPageModalProps> = ({
  visible,
  currentPage,
  currentPageLabel,
  totalPages,
  pagesList,
  onNavigate,
  onClose,
}) => {
  const [pageInput, setPageInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      // Pre-fill with current page label if available, otherwise page number
      setPageInput(currentPageLabel || currentPage.toString());
      setError('');
    }
  }, [visible, currentPage, currentPageLabel]);

  const handleGo = () => {
    const input = pageInput.trim();

    // First, try to find by page label (case-insensitive)
    const matchByLabel = pagesList.find(
      (p) => p.page_label?.toLowerCase() === input.toLowerCase()
    );

    if (matchByLabel) {
      onNavigate(matchByLabel.page_number);
      onClose();
      return;
    }

    // If not found by label, try as page number
    const pageNumber = parseInt(input, 10);
    if (isNaN(pageNumber)) {
      setError('Please enter a valid page label or number');
      return;
    }
    if (pageNumber < 1 || pageNumber > totalPages) {
      setError(`Page number must be between 1 and ${totalPages}`);
      return;
    }
    onNavigate(pageNumber);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Go to Page</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Current: {currentPageLabel ? `${currentPageLabel} (page ${currentPage})` : `Page ${currentPage}`}
            </Text>
            <Text style={styles.infoText}>
              Total pages: {totalPages}
            </Text>
          </View>

          {/* Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Page Label or Number</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={pageInput}
              onChangeText={(text) => {
                setPageInput(text);
                setError('');
              }}
              placeholder="e.g., A, i, 1"
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="none"
              returnKeyType="go"
              autoFocus
              selectTextOnFocus
              onSubmitEditing={handleGo}
            />
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.goButton]}
              onPress={handleGo}
            >
              <Text style={styles.goButtonText}>Go</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  infoContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.xl,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: typography.weights.semibold,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    color: colors.error,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  cancelButton: {
    backgroundColor: colors.background.secondary,
  },
  cancelButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  goButton: {
    backgroundColor: colors.primary,
  },
  goButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
  },
});
