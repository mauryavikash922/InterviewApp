import DateTimePicker, { type DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { Modal, Pressable, Text, View } from 'react-native';
import { strings } from '../../../../locales/en';
import { styles } from './styles';

type DatePickerModalProps = {
  visible: boolean;
  value: Date;
  minimumDate: Date;
  onValueChange: (event: DateTimePickerChangeEvent, date: Date) => void;
  onClose: () => void;
};

export function DatePickerModal({
  visible,
  value,
  minimumDate,
  onValueChange,
  onClose,
}: DatePickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{strings('search.datePickerTitle')}</Text>
          <DateTimePicker
            value={value}
            mode="date"
            display="inline"
            minimumDate={minimumDate}
            onValueChange={onValueChange}
          />
          <Pressable style={styles.doneButton} onPress={onClose} accessibilityRole="button">
            <Text style={styles.doneText}>{strings('common.done')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
