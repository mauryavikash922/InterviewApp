import { KeyboardAvoidingView, ScrollView } from 'react-native';
import type { SearchStackScreenProps } from '../../navigation/types';
import { ConfirmFooter } from './components/ConfirmFooter/ConfirmFooter';
import { HoldTimerText } from './components/HoldTimerText/HoldTimerText';
import { PassengerForm } from './components/PassengerForm/PassengerForm';
import { KEYBOARD_BEHAVIOR } from './constants';
import { usePassengerDetailsViewModel } from './hooks/usePassengerDetailsViewModel';
import { styles } from './styles';

export function PassengerDetailsScreen({ navigation }: SearchStackScreenProps<'PassengerDetails'>) {
  const vm = usePassengerDetailsViewModel(navigation);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={KEYBOARD_BEHAVIOR}>
      <HoldTimerText text={vm.holdText} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {vm.forms.map((form) => (
          <PassengerForm
            key={form.key}
            form={form}
            genderOptions={vm.genderOptions}
            onNameChange={vm.handleNameChange}
            onAgeChange={vm.handleAgeChange}
            onGenderSelect={vm.handleGenderSelect}
          />
        ))}
        <ConfirmFooter
          errorMessage={vm.errorMessage}
          isLoading={vm.isConfirming}
          onConfirm={vm.handleConfirm}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
