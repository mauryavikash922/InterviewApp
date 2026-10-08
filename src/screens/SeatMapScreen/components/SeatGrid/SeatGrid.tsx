import { createContext, useContext } from 'react';
import { FlatList, Text, View, type ListRenderItemInfo } from 'react-native';
import { SEAT_ROW_HEIGHT } from '../../constants';
import type { ColumnGroupsVM, SeatPressHandler, SeatRowVM } from '../../types';
import { SeatRow } from '../SeatRow/SeatRow';
import { styles } from './styles';

type SeatGridProps = {
  rows: SeatRowVM[];
  columns: ColumnGroupsVM;
  onSeatPress: SeatPressHandler;
};

const noopSeatPress: SeatPressHandler = () => undefined;

// Lets renderItem stay at module scope while rows still receive the (stable) press handler.
const SeatPressContext = createContext<SeatPressHandler>(noopSeatPress);

function SeatGridRow({ row }: { row: SeatRowVM }) {
  const onSeatPress = useContext(SeatPressContext);
  return <SeatRow row={row} onSeatPress={onSeatPress} />;
}

const renderRow = ({ item }: ListRenderItemInfo<SeatRowVM>) => <SeatGridRow row={item} />;

const keyExtractor = (row: SeatRowVM): string => row.key;

const getItemLayout = (_data: ArrayLike<SeatRowVM> | null | undefined, index: number) => ({
  length: SEAT_ROW_HEIGHT,
  offset: SEAT_ROW_HEIGHT * index,
  index,
});

export function SeatGrid({ rows, columns, onSeatPress }: SeatGridProps) {
  return (
    <SeatPressContext.Provider value={onSeatPress}>
      <View style={styles.header}>
        <View style={styles.rowLabelSpacer} />
        {columns.left.map((column) => (
          <Text key={column} style={styles.columnLabel}>
            {column}
          </Text>
        ))}
        <View style={styles.aisle} />
        {columns.right.map((column) => (
          <Text key={column} style={styles.columnLabel}>
            {column}
          </Text>
        ))}
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={rows}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
      />
    </SeatPressContext.Provider>
  );
}
