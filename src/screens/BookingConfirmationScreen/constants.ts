import { Gender } from '../../constants/Enums';

export const GENDER_SHORT_KEYS = {
  [Gender.MALE]: 'confirmation.genderShort.MALE',
  [Gender.FEMALE]: 'confirmation.genderShort.FEMALE',
  [Gender.OTHER]: 'confirmation.genderShort.OTHER',
} as const;

export const STATUS_KEYS = {
  CONFIRMED: 'common.status.CONFIRMED',
  EXPIRED: 'common.status.EXPIRED',
} as const;
