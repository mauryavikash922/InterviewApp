import { StyleSheet } from 'react-native';
import { colors, opacity, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  errorText: {
    ...typography.label,
    color: colors.error,
    textAlign: 'center',
  },
  button: {
    height: sizes.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: opacity.disabled,
  },
  buttonLabel: {
    ...typography.bodyBold,
    color: colors.onPrimary,
  },
});
