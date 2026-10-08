import { Text, View } from 'react-native';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

export function BookingNotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{strings('confirmation.notFound')}</Text>
    </View>
  );
}
