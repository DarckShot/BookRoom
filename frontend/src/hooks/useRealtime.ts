import { useContext } from 'react';
import { RealtimeContext } from '../contexts/realtime';

export const useRealtime = () => useContext(RealtimeContext);
