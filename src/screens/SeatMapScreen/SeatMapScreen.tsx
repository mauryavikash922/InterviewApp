import { View } from 'react-native';
import { LEGEND_ITEMS } from '../../constants/legend';
import { strings } from '../../locales/en';
import type { SearchStackScreenProps } from '../../navigation/types';
import { ActionButton } from './components/ActionButton/ActionButton';
import { HoldTimer } from './components/HoldTimer/HoldTimer';
import { Legend } from './components/Legend/Legend';
import { SeatGrid } from './components/SeatGrid/SeatGrid';
import { SelectionSummary } from './components/SelectionSummary/SelectionSummary';
import { StatusView } from './components/StatusView/StatusView';
import { TripHeader } from './components/TripHeader/TripHeader';
import { useSeatMapViewModel } from './hooks/useSeatMapViewModel';
import { styles } from './styles';

export function SeatMapScreen({ navigation }: SearchStackScreenProps<'SeatMap'>) {
  const vm = useSeatMapViewModel(navigation);

  return (
    <View style={styles.container}>
      <TripHeader routeText={vm.routeText} subtitleText={vm.subtitleText} />
      <Legend items={LEGEND_ITEMS} />
      <View style={styles.content}>
        {vm.loadStatus === 'loading' ? (
          <StatusView message={strings('seatMap.loading')} isLoading />
        ) : null}
        {vm.loadStatus === 'error' ? (
          <StatusView
            message={strings('seatMap.error')}
            actionLabel={strings('seatMap.retry')}
            onAction={vm.handleRetry}
          />
        ) : null}
        {vm.loadStatus === 'ready' ? (
          <SeatGrid rows={vm.rows} columns={vm.columns} onSeatPress={vm.handleSeatPress} />
        ) : null}
      </View>
      <View style={styles.footer}>
        <SelectionSummary
          summaryText={vm.summaryText}
          hintText={vm.hintText}
          noticeText={vm.noticeText}
        />
        <HoldTimer text={vm.timerText} />
        <ActionButton
          label={strings('seatMap.suggest')}
          onPress={vm.handleSuggest}
          isDisabled={!vm.canSuggest}
          variant="secondary"
        />
        <ActionButton
          label={strings('seatMap.proceed')}
          onPress={vm.handleProceed}
          isDisabled={!vm.canProceed}
        />
      </View>
    </View>
  );
}
