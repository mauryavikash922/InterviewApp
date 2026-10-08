import { StyleSheet } from 'react-native';
import { borderWidth, colors, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.divider,
  },
  route: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
});
