import { View } from 'react-native';
import type { BookingsStackScreenProps } from '../../navigation/types';
import { BookingList } from './components/BookingList/BookingList';
import { ListStatus } from './components/ListStatus/ListStatus';
import { useMyBookingsViewModel } from './hooks/useMyBookingsViewModel';
import { styles } from './styles';

export function MyBookingsScreen({ navigation }: BookingsStackScreenProps<'MyBookings'>) {
  const { viewState, cards, isRefreshing, handleRetry, handleRefresh, handleView } =
    useMyBookingsViewModel(navigation);

  return (
    <View style={styles.container}>
      {viewState.kind === 'list' ? (
        <BookingList
          cards={cards}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          onView={handleView}
        />
      ) : (
        <ListStatus kind={viewState.kind} onRetry={handleRetry} />
      )}
    </View>
  );
}
