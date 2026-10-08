import { Text, View } from 'react-native';
import { strings } from '../../../../locales/en';
import type { PassengerRowVM } from '../../types';
import { styles } from './styles';

type PassengerTableProps = {
  rows: readonly PassengerRowVM[];
};

type PassengerTableRowProps = {
  row: PassengerRowVM;
};

function PassengerTableRow({ row }: PassengerTableRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.nameCell]} numberOfLines={1}>
        {row.name}
      </Text>
      <Text style={styles.cell}>{row.seat}</Text>
      <Text style={styles.cell}>{row.age}</Text>
      <Text style={styles.cell}>{row.gender}</Text>
    </View>
  );
}

export function PassengerTable({ rows }: PassengerTableProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.headerCell, styles.nameCell]}>
          {strings('confirmation.table.passenger')}
        </Text>
        <Text style={styles.headerCell}>{strings('confirmation.table.seat')}</Text>
        <Text style={styles.headerCell}>{strings('confirmation.table.age')}</Text>
        <Text style={styles.headerCell}>{strings('confirmation.table.gender')}</Text>
      </View>
      {rows.map((row) => (
        <PassengerTableRow key={row.key} row={row} />
      ))}
    </View>
  );
}
