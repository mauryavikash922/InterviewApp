import { Pressable, Text, View } from 'react-native';
import type { SeatPreference } from '../../../../constants/Enums';
import { hitSlop } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import type { PreferenceOptionVM } from '../../types';
import { styles } from './styles';

type PreferenceRadioProps = {
  options: readonly PreferenceOptionVM[];
  onSelect: (preference: SeatPreference) => void;
};

type RadioOptionProps = {
  option: PreferenceOptionVM;
  onSelect: (preference: SeatPreference) => void;
};

function RadioOption({ option, onSelect }: RadioOptionProps) {
  const handlePress = () => onSelect(option.value);

  return (
    <Pressable
      style={styles.option}
      onPress={handlePress}
      hitSlop={hitSlop}
      accessibilityRole="radio"
      accessibilityLabel={strings('search.a11y.preferenceOption', { option: option.label })}
      accessibilityState={{ checked: option.isSelected }}
    >
      <View style={[styles.outer, option.isSelected && styles.outerSelected]}>
        {option.isSelected ? <View style={styles.inner} /> : null}
      </View>
      <Text style={styles.label}>{option.label}</Text>
    </Pressable>
  );
}

export function PreferenceRadio({ options, onSelect }: PreferenceRadioProps) {
  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {options.map((option) => (
        <RadioOption key={option.value} option={option} onSelect={onSelect} />
      ))}
    </View>
  );
}
