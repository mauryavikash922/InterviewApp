import { Text, View } from 'react-native';
import { styles } from './styles';

type BookingSummaryProps = {
  bookingIdText: string;
  routeText: string;
  dateText: string;
};

export function BookingSummary({ bookingIdText, routeText, dateText }: BookingSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.bookingId} selectable>
        {bookingIdText}
      </Text>
      <Text style={styles.route}>{routeText}</Text>
      <Text style={styles.date}>{dateText}</Text>
    </View>
  );
}
