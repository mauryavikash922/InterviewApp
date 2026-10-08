import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  bookingId: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  route: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  date: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
