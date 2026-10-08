import { StyleSheet } from 'react-native';
import { colors, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  button: {
    height: sizes.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.bodyBold,
    color: colors.onPrimary,
  },
});
