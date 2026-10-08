import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

type ConfirmFooterProps = {
  errorMessage: string | null;
  isLoading: boolean;
  onConfirm: () => void;
};

export function ConfirmFooter({ errorMessage, isLoading, onConfirm }: ConfirmFooterProps) {
  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {errorMessage}
        </Text>
      ) : null}
      <Pressable
        style={[styles.button, isLoading ? styles.buttonDisabled : null]}
        onPress={onConfirm}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityState={{ disabled: isLoading, busy: isLoading }}
      >
        {isLoading ? <ActivityIndicator color={colors.onPrimary} /> : null}
        <Text style={styles.buttonLabel}>
          {strings(isLoading ? 'passengerDetails.confirming' : 'passengerDetails.confirm')}
        </Text>
      </Pressable>
    </View>
  );
}
