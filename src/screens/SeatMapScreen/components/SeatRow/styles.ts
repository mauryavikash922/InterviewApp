import { StyleSheet } from 'react-native';
import { colors, sizes, typography } from '../../../../constants/theme';
import { SEAT_ROW_HEIGHT } from '../../constants';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: SEAT_ROW_HEIGHT,
  },
  rowLabel: {
    ...typography.mono,
    width: sizes.rowLabelWidth,
    color: colors.textSecondary,
  },
  aisle: {
    width: sizes.aisleWidth,
  },
});
