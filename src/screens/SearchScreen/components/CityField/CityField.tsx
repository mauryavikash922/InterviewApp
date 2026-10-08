import { Pressable, Text } from 'react-native';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

type CityFieldProps = {
  value: string | null;
  hasError: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

export function CityField({ value, hasError, accessibilityLabel, onPress }: CityFieldProps) {
  return (
    <Pressable
      style={[styles.box, hasError && styles.boxError]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={value ? styles.value : styles.placeholder} numberOfLines={1}>
        {value ?? strings('search.cityPlaceholder')}
      </Text>
    </Pressable>
  );
}
