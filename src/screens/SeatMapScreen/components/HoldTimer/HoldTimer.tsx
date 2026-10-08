import { Text } from 'react-native';
import { styles } from './styles';

type HoldTimerProps = {
  text: string | null;
};

export function HoldTimer({ text }: HoldTimerProps) {
  if (text === null) {
    return null;
  }
  return (
    <Text style={styles.text} accessibilityRole="timer">
      {text}
    </Text>
  );
}
