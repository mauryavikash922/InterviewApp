import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { styles } from './styles';

const ICON = require('../../../assets/icon.png');

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Expo App</Text>
      <Image source={ICON} style={styles.icon} contentFit="contain" />
    </View>
  );
}
