import { useCallback } from 'react';
import { FlatList, Text, View, type ListRenderItem } from 'react-native';
import { strings } from '../../../../locales/en';
import type { BookingCardVM } from '../../types';
import { BookingCard } from '../BookingCard/BookingCard';
import { styles } from './styles';

type Props = {
  cards: BookingCardVM[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onView: (bookingId: string) => void;
};

const keyExtractor = (card: BookingCardVM): string => card.id;

const ItemSeparator = () => <View style={styles.separator} />;

const ListFooter = () => <Text style={styles.footer}>{strings('myBookings.noMore')}</Text>;

export function BookingList({ cards, isRefreshing, onRefresh, onView }: Props) {
  // Needs onView, so it can't live at module scope; stable as long as onView is.
  const renderItem = useCallback<ListRenderItem<BookingCardVM>>(
    ({ item }) => <BookingCard card={item} onView={onView} />,
    [onView],
  );

  return (
    <FlatList
      data={cards}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooter}
      contentContainerStyle={styles.content}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
}
