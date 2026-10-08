import { Pressable, Text, View } from 'react-native';
import type { Gender } from '../../../../constants/Enums';
import { hitSlop } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import type { GenderOptionVM } from '../../types';
import { styles } from './styles';

type GenderRadioProps = {
  options: readonly GenderOptionVM[];
  selected: Gender | null;
  onSelect: (gender: Gender) => void;
  errorMessage: string | null;
};

type GenderOptionProps = {
  option: GenderOptionVM;
  isSelected: boolean;
  onSelect: (gender: Gender) => void;
};

function GenderOption({ option, isSelected, onSelect }: GenderOptionProps) {
  const handlePress = () => onSelect(option.value);

  return (
    <Pressable
      style={styles.option}
      onPress={handlePress}
      hitSlop={hitSlop}
      accessibilityRole="radio"
      accessibilityLabel={option.accessibilityLabel}
      accessibilityState={{ checked: isSelected }}
    >
      <View style={[styles.radioOuter, isSelected ? styles.radioOuterSelected : null]}>
        {isSelected ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={styles.optionLabel}>{option.label}</Text>
    </Pressable>
  );
}

export function GenderRadio({ options, selected, onSelect, errorMessage }: GenderRadioProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row} accessibilityRole="radiogroup">
        <Text style={styles.label}>{strings('passengerDetails.genderLabel')}</Text>
        {options.map((option) => (
          <GenderOption
            key={option.value}
            option={option}
            isSelected={option.value === selected}
            onSelect={onSelect}
          />
        ))}
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}
