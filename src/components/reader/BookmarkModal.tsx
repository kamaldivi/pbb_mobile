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
import { colors, spacing, typography, borderRadius, shadows } from '@/theme';

interface BookmarkModalProps {
  visible: boolean;
  bookTitle: string;
  pageNumber: number;
  existingName?: string;
  onSave: (customName: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export const BookmarkModal: React.FC<BookmarkModalProps> = ({
  visible,
  bookTitle,
  pageNumber,
  existingName,
  onSave,
  onDelete,
  onClose,
}) => {
  const [customName, setCustomName] = useState(existingName || '');
  const isEditing = !!existingName;

  useEffect(() => {
    if (visible) {
      setCustomName(existingName || '');
    }
  }, [visible, existingName]);

  const handleSave = () => {
    onSave(customName.trim());
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
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
            <Text style={styles.title}>
              {isEditing ? 'Edit Bookmark' : 'Add Bookmark'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Book Info */}
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {bookTitle}
            </Text>
            <Text style={styles.pageInfo}>Page {pageNumber}</Text>
          </View>

          {/* Custom Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bookmark Name (Optional)</Text>
            <TextInput
              style={styles.input}
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g., Important quote, Chapter 3 start..."
              placeholderTextColor={colors.text.tertiary}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            <Text style={styles.hint}>
              Leave blank to use default: "Page {pageNumber}"
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {isEditing && onDelete && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}

            <View style={styles.primaryActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {isEditing ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
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
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.xl,
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
  bookInfo: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  bookTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  pageInfo: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
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
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  hint: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
  primaryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  deleteButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  cancelButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.inverse,
  },
});
