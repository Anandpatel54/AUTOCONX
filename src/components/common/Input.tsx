import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, shadows } from '../../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string | null;
  helperText?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
  rightAccessory?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  required = false,
  rightAccessory,
  style,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          restProps.multiline && styles.multilineContainer,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, restProps.multiline && styles.multilineInput, style]}
          {...restProps}
        />
        {rightAccessory && <View style={styles.rightAccessory}>{rightAccessory}</View>}
      </View>

      {hasError ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  requiredStar: {
    color: colors.error,
    fontWeight: '800',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
    ...shadows.subtle,
  },
  inputFocused: {
    borderColor: colors.accent,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
  },
  inputError: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.errorBg,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
    paddingVertical: spacing.sm,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    minHeight: 90,
    paddingVertical: spacing.sm,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 72,
  },
  rightAccessory: {
    marginLeft: spacing.sm,
  },
  errorText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
  },
  helperText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
