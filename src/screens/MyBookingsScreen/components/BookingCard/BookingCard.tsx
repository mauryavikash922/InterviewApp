import { memo } from 'react';
import { Pressable, Text, View, type PressableStateCallbackType, type TextStyle } from 'react-native';
import { BookingStatus } from '../../../../constants/Enums';
import { hitSlop } from '../../../../constants/theme';
import { strings } from '../../../../locales/en';
import type { BookingCardVM } from '../../types';
import { styles } from './styles';

type Props = {
  card: BookingCardVM;
  onView: (bookingId: string) => void;
};

const STATUS_STYLE: Record<BookingStatus, TextStyle> = {
  [BookingStatus.CONFIRMED]: styles.statusConfirmed,
  [BookingStatus.EXPIRED]: styles.statusExpired,
};

const viewButtonStyle = ({ pressed }: PressableStateCallbackType) =>
  pressed ? [styles.viewButton, styles.viewButtonPressed] : styles.viewButton;

function BookingCardComponent({ card, onView }: Props) {
  const handleViewPress = () => {
    onView(card.id);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.bookingId}>{card.id}</Text>
      <Text style={styles.route}>{card.route}</Text>
      <Text style={styles.meta}>{card.dateAndSeats}</Text>
      <View style={styles.footer}>
        <Text style={[styles.status, STATUS_STYLE[card.status]]}>{card.statusLabel}</Text>
        <Pressable
          accessibilityRole="button"
          hitSlop={hitSlop}
          onPress={handleViewPress}
          style={viewButtonStyle}
        >
          <Text style={styles.viewButtonText}>{strings('myBookings.view')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const BookingCard = memo(BookingCardComponent);
