import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../constants/theme';

export const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
