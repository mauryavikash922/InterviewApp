import { Text, View } from 'react-native';
import { styles } from './styles';

type TripHeaderProps = {
  routeText: string;
  subtitleText: string;
};

export function TripHeader({ routeText, subtitleText }: TripHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.route} accessibilityRole="header">
        {routeText}
      </Text>
      <Text style={styles.subtitle}>{subtitleText}</Text>
    </View>
  );
}
