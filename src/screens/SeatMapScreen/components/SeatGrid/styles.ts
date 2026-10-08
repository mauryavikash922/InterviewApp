import { StyleSheet } from 'react-native';
import { colors, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  rowLabelSpacer: {
    width: sizes.rowLabelWidth,
  },
  columnLabel: {
    ...typography.label,
    width: sizes.seatCell,
    marginHorizontal: spacing.xxs,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  aisle: {
    width: sizes.aisleWidth,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.sm,
  },
});
