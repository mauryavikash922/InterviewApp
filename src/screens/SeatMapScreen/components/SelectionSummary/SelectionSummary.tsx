import { Text, View } from 'react-native';
import { styles } from './styles';

type SelectionSummaryProps = {
  summaryText: string;
  hintText: string | null;
  noticeText: string | null;
};

export function SelectionSummary({ summaryText, hintText, noticeText }: SelectionSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.summary}>{summaryText}</Text>
      {noticeText ? (
        <Text style={styles.notice} accessibilityLiveRegion="polite">
          {noticeText}
        </Text>
      ) : null}
      {hintText ? <Text style={styles.hint}>{hintText}</Text> : null}
    </View>
  );
}
