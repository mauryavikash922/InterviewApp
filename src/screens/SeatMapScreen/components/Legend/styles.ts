import { StyleSheet } from 'react-native';
import { SeatState } from '../../../../constants/Enums';
import { legendMapping } from '../../../../constants/legend';
import { borderWidth, colors, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.label,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginVertical: spacing.xxs,
  },
  swatch: {
    width: sizes.legendSwatch,
    height: sizes.legendSwatch,
    borderRadius: radius.sm,
    borderWidth: borderWidth.hairline,
    marginRight: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
  },
});

export const swatchStyles = StyleSheet.create({
  [SeatState.AVAILABLE]: {
    backgroundColor: legendMapping[SeatState.AVAILABLE].color,
    borderColor: legendMapping[SeatState.AVAILABLE].borderColor,
  },
  [SeatState.OCCUPIED]: {
    backgroundColor: legendMapping[SeatState.OCCUPIED].color,
    borderColor: legendMapping[SeatState.OCCUPIED].borderColor,
  },
  [SeatState.SELECTED]: {
    backgroundColor: legendMapping[SeatState.SELECTED].color,
    borderColor: legendMapping[SeatState.SELECTED].borderColor,
  },
});
