import { StyleSheet } from 'react-native';
import { colors, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  text: {
    ...typography.bodyBold,
  },
  confirmed: {
    color: colors.statusConfirmed,
  },
  expired: {
    color: colors.statusExpired,
  },
});
