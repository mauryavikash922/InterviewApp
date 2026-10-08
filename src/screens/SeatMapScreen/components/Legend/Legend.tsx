import { Text, View } from 'react-native';
import type { LegendEntry } from '../../../../constants/legend';
import { strings } from '../../../../locales/en';
import { styles, swatchStyles } from './styles';

type LegendProps = {
  items: readonly LegendEntry[];
};

export function Legend({ items }: LegendProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings('seatMap.legendTitle')}</Text>
      <View style={styles.items}>
        {items.map((item) => (
          <View key={item.state} style={styles.item}>
            <View style={[styles.swatch, swatchStyles[item.state]]} />
            <Text style={styles.label}>{strings(item.labelKey)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
