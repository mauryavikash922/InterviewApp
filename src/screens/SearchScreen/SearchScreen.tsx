import { ScrollView } from 'react-native';
import { strings } from '../../locales/en';
import type { SearchStackScreenProps } from '../../navigation/types';
import { CityField } from './components/CityField/CityField';
import { CityPickerModal } from './components/CityPickerModal/CityPickerModal';
import { DateField } from './components/DateField/DateField';
import { DatePickerModal } from './components/DatePickerModal/DatePickerModal';
import { FormField } from './components/FormField/FormField';
import { PassengerStepper } from './components/PassengerStepper/PassengerStepper';
import { PreferenceRadio } from './components/PreferenceRadio/PreferenceRadio';
import { PrimaryButton } from './components/PrimaryButton/PrimaryButton';
import { useSearchViewModel } from './hooks/useSearchViewModel';
import { styles } from './styles';

export function SearchScreen({ navigation }: SearchStackScreenProps<'Search'>) {
  const vm = useSearchViewModel(navigation);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <FormField label={strings('search.fromLabel')} error={vm.errors.source}>
        <CityField
          value={vm.sourceLabel}
          hasError={Boolean(vm.errors.source)}
          accessibilityLabel={strings('search.a11y.selectOrigin')}
          onPress={vm.handleOpenOriginPicker}
        />
      </FormField>
      <FormField label={strings('search.toLabel')} error={vm.errors.destination}>
        <CityField
          value={vm.destinationLabel}
          hasError={Boolean(vm.errors.destination)}
          accessibilityLabel={strings('search.a11y.selectDestination')}
          onPress={vm.handleOpenDestinationPicker}
        />
      </FormField>
      <FormField label={strings('search.dateLabel')} error={vm.errors.travelDate}>
        <DateField
          value={vm.dateLabel}
          hasError={Boolean(vm.errors.travelDate)}
          onPickPress={vm.handleOpenDatePicker}
        />
      </FormField>
      <FormField label={strings('search.passengersLabel')} error={vm.errors.passengerCount}>
        <PassengerStepper
          count={vm.passengerCount}
          canDecrement={vm.canDecrementPassengers}
          canIncrement={vm.canIncrementPassengers}
          onDecrement={vm.handleDecrementPassengers}
          onIncrement={vm.handleIncrementPassengers}
        />
      </FormField>
      <FormField label={strings('search.preferenceLabel')}>
        <PreferenceRadio options={vm.preferenceOptions} onSelect={vm.handlePreferenceSelect} />
      </FormField>
      <PrimaryButton label={strings('search.submit')} onPress={vm.handleSubmit} />
      <CityPickerModal
        visible={vm.isCityPickerVisible}
        title={vm.cityPickerTitle}
        options={vm.cityOptions}
        onClose={vm.handleClosePicker}
      />
      <DatePickerModal
        visible={vm.isDatePickerVisible}
        value={vm.pickerDate}
        minimumDate={vm.minimumDate}
        onValueChange={vm.handleDateValueChange}
        onClose={vm.handleClosePicker}
      />
    </ScrollView>
  );
}
