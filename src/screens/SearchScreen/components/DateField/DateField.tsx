import { Pressable, Text, View } from 'react-native';
import { hitSlop } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

type DateFieldProps = {
  value: string | null;
  hasError: boolean;
  onPickPress: () => void;
};

export function DateField({ value, hasError, onPickPress }: DateFieldProps) {
  return (
    <View style={[styles.box, hasError && styles.boxError]}>
      <Text style={value ? styles.value : styles.placeholder}>
        {value ?? strings('search.datePlaceholder')}
      </Text>
      <Pressable
        style={styles.pickButton}
        onPress={onPickPress}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={strings('search.a11y.pickDate')}
      >
        <Text style={styles.pickText}>{strings('search.pickDate')}</Text>
      </Pressable>
    </View>
  );
}
