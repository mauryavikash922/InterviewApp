import { Pressable, Text, View } from 'react-native';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

type ConfirmationActionsProps = {
  onViewAllBookings: () => void;
  onShare: () => void;
};

export function ConfirmationActions({ onViewAllBookings, onShare }: ConfirmationActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, styles.primaryButton]}
        onPress={onViewAllBookings}
        accessibilityRole="button"
      >
        <Text style={styles.primaryLabel}>{strings('confirmation.viewAllBookings')}</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={onShare}
        accessibilityRole="button"
      >
        <Text style={styles.secondaryLabel}>{strings('confirmation.share')}</Text>
      </Pressable>
    </View>
  );
}
