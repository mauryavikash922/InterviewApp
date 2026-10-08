import { StyleSheet } from 'react-native';
import { borderWidth, colors, opacity, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  button: {
    height: sizes.buttonHeight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  disabled: {
    opacity: opacity.disabled,
  },
  label: {
    ...typography.bodyBold,
  },
});

export const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: borderWidth.hairline,
    borderColor: colors.primary,
  },
});

export const labelStyles = StyleSheet.create({
  primary: { color: colors.onPrimary },
  secondary: { color: colors.primary },
});
