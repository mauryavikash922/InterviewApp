import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  summary: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  notice: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
