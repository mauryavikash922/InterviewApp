import { StyleSheet } from 'react-native';
import { borderWidth, colors, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: borderWidth.hairline,
    borderColor: colors.divider,
  },
  heading: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  input: {
    ...typography.body,
    height: sizes.inputHeight,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
});
