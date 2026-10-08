import { Text, TextInput, View } from 'react-native';
import type { Gender } from '../../../../constants/Enums';
import { colors } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import { AGE_MAX_LENGTH, NAME_MAX_LENGTH } from '../../constants';
import type { GenderOptionVM, PassengerFormVM } from '../../types';
import { GenderRadio } from '../GenderRadio/GenderRadio';
import { styles } from './styles';

type PassengerFormProps = {
  form: PassengerFormVM;
  genderOptions: readonly GenderOptionVM[];
  onNameChange: (index: number, value: string) => void;
  onAgeChange: (index: number, value: string) => void;
  onGenderSelect: (index: number, gender: Gender) => void;
};

export function PassengerForm({
  form,
  genderOptions,
  onNameChange,
  onAgeChange,
  onGenderSelect,
}: PassengerFormProps) {
  const handleNameChange = (value: string) => onNameChange(form.index, value);
  const handleAgeChange = (value: string) => onAgeChange(form.index, value);
  const handleGenderSelect = (gender: Gender) => onGenderSelect(form.index, gender);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{form.heading}</Text>
      <TextInput
        style={[styles.input, form.nameError ? styles.inputError : null]}
        value={form.name}
        onChangeText={handleNameChange}
        placeholder={strings('passengerDetails.namePlaceholder')}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={strings('passengerDetails.namePlaceholder')}
        autoCapitalize="words"
        autoComplete="name"
        maxLength={NAME_MAX_LENGTH}
        returnKeyType="next"
      />
      {form.nameError ? <Text style={styles.errorText}>{form.nameError}</Text> : null}
      <TextInput
        style={[styles.input, form.ageError ? styles.inputError : null]}
        value={form.age}
        onChangeText={handleAgeChange}
        placeholder={strings('passengerDetails.agePlaceholder')}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={strings('passengerDetails.agePlaceholder')}
        keyboardType="number-pad"
        maxLength={AGE_MAX_LENGTH}
      />
      {form.ageError ? <Text style={styles.errorText}>{form.ageError}</Text> : null}
      <GenderRadio
        options={genderOptions}
        selected={form.gender}
        onSelect={handleGenderSelect}
        errorMessage={form.genderError}
      />
    </View>
  );
}
