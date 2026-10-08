import { StyleSheet } from 'react-native';
import { SeatState } from '../../../../constants/Enums';
import { legendMapping } from '../../../../constants/legend';
import { borderWidth, colors, radius, sizes, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  cell: {
    width: sizes.seatCell,
    height: sizes.seatCell,
    borderRadius: radius.sm,
    borderWidth: borderWidth.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xxs,
  },
  label: {
    ...typography.caption,
  },
});

export const cellStyles = StyleSheet.create({
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

export const labelStyles = StyleSheet.create({
  [SeatState.AVAILABLE]: { color: colors.textPrimary },
  [SeatState.OCCUPIED]: { color: colors.textMuted },
  [SeatState.SELECTED]: { color: colors.onPrimary },
});
