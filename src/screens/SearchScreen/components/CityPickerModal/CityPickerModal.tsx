import { FlatList, Modal, Pressable, Text, View, type ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { borderWidth, sizes } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import type { CityOptionVM } from '../../types';
import { styles } from './styles';

type CityPickerModalProps = {
  visible: boolean;
  title: string;
  options: readonly CityOptionVM[];
  onClose: () => void;
};

function CityRow({ id, label, isSelected, onSelect }: CityOptionVM) {
  const handlePress = () => onSelect(id);

  return (
    <Pressable
      style={[styles.row, isSelected && styles.rowSelected]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={isSelected ? styles.rowTextSelected : styles.rowText}>{label}</Text>
    </Pressable>
  );
}

const renderItem: ListRenderItem<CityOptionVM> = ({ item }) => <CityRow {...item} />;
const keyExtractor = (item: CityOptionVM): string => item.id;
// Row height plus its hairline separator, so offsets stay exact.
const ROW_STRIDE = sizes.inputHeight + borderWidth.hairline;

const getItemLayout = (_data: ArrayLike<CityOptionVM> | null | undefined, index: number) => ({
  length: ROW_STRIDE,
  offset: ROW_STRIDE * index,
  index,
});
const ItemSeparator = () => <View style={styles.separator} />;

export function CityPickerModal({ visible, title, options, onClose }: CityPickerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose} accessibilityRole="button">
            <Text style={styles.close}>{strings('common.close')}</Text>
          </Pressable>
        </View>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={ItemSeparator}
        />
      </SafeAreaView>
    </Modal>
  );
}
