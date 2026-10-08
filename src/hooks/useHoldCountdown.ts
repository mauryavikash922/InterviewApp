import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { HOLD_TICK_MS } from '../constants/seatMap';

type UseHoldCountdownParams = {
  holdExpiresAt: number | null;
  isActive: boolean;
  onExpire: () => void;
};

export const useHoldCountdown = ({
  holdExpiresAt,
  isActive,
  onExpire,
}: UseHoldCountdownParams): number | null => {
  const [now, setNow] = useState(Date.now);
  const onExpireRef = useRef(onExpire);
  const firedForRef = useRef<number | null>(null);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (holdExpiresAt === null || !isActive) {
      return undefined;
    }
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= holdExpiresAt && firedForRef.current !== holdExpiresAt) {
        firedForRef.current = holdExpiresAt;
        onExpireRef.current();
      }
    };
    tick();
    const interval: ReturnType<typeof setInterval> = setInterval(tick, HOLD_TICK_MS);
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        tick();
      }
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [holdExpiresAt, isActive]);

  return holdExpiresAt === null ? null : Math.max(0, holdExpiresAt - now);
};
