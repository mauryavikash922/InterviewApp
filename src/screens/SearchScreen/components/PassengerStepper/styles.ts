import { StyleSheet } from 'react-native';
import {
  borderWidth,
  colors,
  opacity,
  radius,
  sizes,
  spacing,
  typography,
} from '../../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    minHeight: sizes.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  button: {
    width: sizes.stepperButton,
    height: sizes.stepperButton,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: opacity.disabled,
  },
  buttonText: {
    ...typography.subtitle,
    color: colors.onPrimary,
  },
  count: {
    ...typography.subtitle,
    color: colors.textPrimary,
    minWidth: sizes.stepperButton,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
  },
});
