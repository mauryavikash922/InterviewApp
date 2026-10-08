import { StyleSheet } from 'react-native';
import { borderWidth, colors, radius, spacing, typography } from '../../../../constants/theme';

const NAME_COLUMN_FLEX = 3;

export const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: colors.divider,
  },
  headerRow: {
    borderTopWidth: 0,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerCell: {
    ...typography.label,
    flex: 1,
    color: colors.textSecondary,
  },
  cell: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
  },
  nameCell: {
    flex: NAME_COLUMN_FLEX,
  },
});
