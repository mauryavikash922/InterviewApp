import { Text, View } from 'react-native';
import { styles } from './styles';

type HoldTimerTextProps = {
  text: string | null;
};

export function HoldTimerText({ text }: HoldTimerTextProps) {
  if (text === null) {
    return null;
  }
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
