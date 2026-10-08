import { Pressable, Text } from 'react-native';
import { labelStyles, styles, variantStyles } from './styles';

type ActionButtonVariant = 'primary' | 'secondary';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  isDisabled?: boolean;
  variant?: ActionButtonVariant;
};

export function ActionButton({
  label,
  onPress,
  isDisabled = false,
  variant = 'primary',
}: ActionButtonProps) {
  return (
    <Pressable
      style={[styles.button, variantStyles[variant], isDisabled ? styles.disabled : null]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </Pressable>
  );
}
