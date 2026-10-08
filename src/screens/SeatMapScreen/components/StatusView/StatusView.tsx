import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../../../../constants/theme';
import { ActionButton } from '../ActionButton/ActionButton';
import { styles } from './styles';

type StatusViewProps = {
  message: string;
  isLoading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

export function StatusView({ message, isLoading = false, actionLabel, onAction }: StatusViewProps) {
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator color={colors.primary} /> : null}
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <ActionButton label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}
