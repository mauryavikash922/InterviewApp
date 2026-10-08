import { StyleSheet } from 'react-native';
import { borderWidth, colors, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.divider,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  close: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  row: {
    height: sizes.inputHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  rowSelected: {
    backgroundColor: colors.background,
  },
  rowText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  rowTextSelected: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  separator: {
    height: borderWidth.hairline,
    backgroundColor: colors.divider,
  },
});
