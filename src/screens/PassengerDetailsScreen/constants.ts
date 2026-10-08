import { Platform, type KeyboardAvoidingViewProps } from 'react-native';
import { Gender } from '../../constants/Enums';
import { strings } from '../../locales/en';
import type { GenderOptionVM } from './types';

export const NAME_MAX_LENGTH = 60;
export const AGE_MAX_LENGTH = 3;

// iOS uses ScrollView.automaticallyAdjustKeyboardInsets; padding here too would double the offset.
export const KEYBOARD_BEHAVIOR: KeyboardAvoidingViewProps['behavior'] = Platform.select({
  android: 'height',
  default: undefined,
});

const GENDER_LABEL_KEYS = {
  [Gender.MALE]: 'passengerDetails.gender.MALE',
  [Gender.FEMALE]: 'passengerDetails.gender.FEMALE',
  [Gender.OTHER]: 'passengerDetails.gender.OTHER',
} as const;

const toGenderOption = (value: Gender): GenderOptionVM => {
  const label = strings(GENDER_LABEL_KEYS[value]);
  return {
    value,
    label,
    accessibilityLabel: strings('passengerDetails.a11y.genderOption', { option: label }),
  };
};

export const GENDER_OPTIONS: readonly GenderOptionVM[] = [
  Gender.MALE,
  Gender.FEMALE,
  Gender.OTHER,
].map(toGenderOption);
