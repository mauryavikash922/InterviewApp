import { StyleSheet } from 'react-native';
import { borderWidth, colors, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  box: {
    minHeight: sizes.inputHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  boxError: {
    borderColor: colors.error,
  },
  value: {
    ...typography.body,
    color: colors.textPrimary,
  },
  placeholder: {
    ...typography.body,
    color: colors.textMuted,
  },
});
