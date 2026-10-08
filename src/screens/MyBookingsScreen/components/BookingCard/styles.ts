import { StyleSheet } from 'react-native';
import { borderWidth, colors, opacity, radius, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: borderWidth.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  bookingId: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  route: {
    ...typography.body,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  status: {
    ...typography.label,
  },
  statusConfirmed: {
    color: colors.statusConfirmed,
  },
  statusExpired: {
    color: colors.statusExpired,
  },
  viewButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  viewButtonPressed: {
    opacity: opacity.pressed,
  },
  viewButtonText: {
    ...typography.label,
    color: colors.onPrimary,
  },
});
