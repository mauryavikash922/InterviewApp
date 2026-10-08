import { StyleSheet } from 'react-native';
import { borderWidth, colors, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: colors.divider,
  },
  text: {
    ...typography.mono,
    color: colors.warning,
    textAlign: 'center',
  },
});
