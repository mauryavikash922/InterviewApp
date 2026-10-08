import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  text: {
    ...typography.mono,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
});
