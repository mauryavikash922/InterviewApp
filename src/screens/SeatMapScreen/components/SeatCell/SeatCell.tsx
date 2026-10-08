import { Pressable, Text } from 'react-native';
import { SeatState } from '../../../../constants/Enums';
import type { SeatCellVM, SeatPressHandler } from '../../types';
import { cellStyles, labelStyles, styles } from './styles';

type SeatCellProps = {
  cell: SeatCellVM;
  onPress: SeatPressHandler;
};

export function SeatCell({ cell, onPress }: SeatCellProps) {
  const isOccupied = cell.state === SeatState.OCCUPIED;
  const handlePress = () => onPress(cell.seatId, cell.state);

  return (
    <Pressable
      style={[styles.cell, cellStyles[cell.state]]}
      onPress={handlePress}
      disabled={isOccupied}
      accessibilityRole="button"
      accessibilityLabel={cell.accessibilityLabel}
      accessibilityState={{ selected: cell.state === SeatState.SELECTED, disabled: isOccupied }}
    >
      <Text style={[styles.label, labelStyles[cell.state]]}>{cell.label}</Text>
    </Pressable>
  );
}
