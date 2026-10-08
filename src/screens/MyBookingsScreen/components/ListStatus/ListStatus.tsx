import { ActivityIndicator, Pressable, Text, View, type PressableStateCallbackType } from 'react-native';
import { colors } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

type Props = {
  kind: 'loading' | 'error' | 'empty';
  onRetry: () => void;
};

const retryButtonStyle = ({ pressed }: PressableStateCallbackType) =>
  pressed ? [styles.retryButton, styles.retryButtonPressed] : styles.retryButton;

export function ListStatus({ kind, onRetry }: Props) {
  if (kind === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.hint}>{strings('myBookings.loading')}</Text>
      </View>
    );
  }

  if (kind === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{strings('myBookings.error')}</Text>
        <Pressable accessibilityRole="button" onPress={onRetry} style={retryButtonStyle}>
          <Text style={styles.retryText}>{strings('myBookings.retry')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings('myBookings.empty')}</Text>
      <Text style={styles.hint}>{strings('myBookings.emptyHint')}</Text>
    </View>
  );
}
