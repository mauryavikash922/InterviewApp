import { Text } from 'react-native';
import { styles } from './styles';

type BookingStatusLineProps = {
  text: string;
  isExpired: boolean;
};

export function BookingStatusLine({ text, isExpired }: BookingStatusLineProps) {
  return <Text style={[styles.text, isExpired ? styles.expired : styles.confirmed]}>{text}</Text>;
}
