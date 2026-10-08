import { StyleSheet } from 'react-native';
import { borderWidth, colors, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
    paddingVertical: spacing.xs,
  },
  outer: {
    width: sizes.radioOuter,
    height: sizes.radioOuter,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: borderWidth.thick,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  outerSelected: {
    borderColor: colors.primary,
  },
  inner: {
    width: sizes.radioInner,
    height: sizes.radioInner,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
