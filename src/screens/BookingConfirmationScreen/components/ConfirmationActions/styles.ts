import { StyleSheet } from 'react-native';
import { borderWidth, colors, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    height: sizes.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: borderWidth.hairline,
    borderColor: colors.primary,
  },
  primaryLabel: {
    ...typography.bodyBold,
    color: colors.onPrimary,
  },
  secondaryLabel: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
