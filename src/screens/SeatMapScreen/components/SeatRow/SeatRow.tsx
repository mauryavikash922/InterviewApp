import { memo } from 'react';
import { Text, View } from 'react-native';
import type { SeatPressHandler, SeatRowVM } from '../../types';
import { SeatCell } from '../SeatCell/SeatCell';
import { styles } from './styles';

type SeatRowProps = {
  row: SeatRowVM;
  onSeatPress: SeatPressHandler;
};

function SeatRowComponent({ row, onSeatPress }: SeatRowProps) {
  return (
    <View style={styles.row} accessibilityLabel={row.accessibilityLabel}>
      <Text style={styles.rowLabel}>{row.rowLabel}</Text>
      {row.left.map((cell) => (
        <SeatCell key={cell.key} cell={cell} onPress={onSeatPress} />
      ))}
      <View style={styles.aisle} />
      {row.right.map((cell) => (
        <SeatCell key={cell.key} cell={cell} onPress={onSeatPress} />
      ))}
    </View>
  );
}

export const SeatRow = memo(SeatRowComponent);
