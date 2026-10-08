import { Pressable, Text, View } from 'react-native';
import { hitSlop } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

type PassengerStepperProps = {
  count: number;
  canDecrement: boolean;
  canIncrement: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
};

export function PassengerStepper({
  count,
  canDecrement,
  canIncrement,
  onDecrement,
  onIncrement,
}: PassengerStepperProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, !canDecrement && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={!canDecrement}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={strings('search.a11y.decrementPassengers')}
        accessibilityState={{ disabled: !canDecrement }}
      >
        <Text style={styles.buttonText}>{strings('search.stepper.decrement')}</Text>
      </Pressable>
      <Text style={styles.count}>{count}</Text>
      <Pressable
        style={[styles.button, !canIncrement && styles.buttonDisabled]}
        onPress={onIncrement}
        disabled={!canIncrement}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={strings('search.a11y.incrementPassengers')}
        accessibilityState={{ disabled: !canIncrement }}
      >
        <Text style={styles.buttonText}>{strings('search.stepper.increment')}</Text>
      </Pressable>
    </View>
  );
}
