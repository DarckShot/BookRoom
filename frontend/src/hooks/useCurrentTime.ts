import { useEffect, useState } from 'react';
import { CLOCK_UPDATE_INTERVAL_MS } from './useCurrentTime.constants';

export const useCurrentTime = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), CLOCK_UPDATE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return now;
};
