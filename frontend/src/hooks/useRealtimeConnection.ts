import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { queryKeys } from '../api/queryKeys';
import { affectsRooms, getRealtimeEventType, getRealtimeUrl } from '../api/realtime';
import { REALTIME_RECONNECT_DELAY_MS } from '../api/realtime.constants';
import type { RealtimeConnectionStatus, RealtimeController } from '../types/realtime';

export const useRealtimeConnection = (): RealtimeController => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RealtimeConnectionStatus>('connecting');
  const [connectionAttempt, setConnectionAttempt] = useState(0);

  useEffect(() => {
    let socket: WebSocket | undefined;
    let reconnectTimer: number | undefined;
    let isDisposed = false;

    const resync = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.offices });
      void queryClient.invalidateQueries({ queryKey: queryKeys.roomsRoot });
    };

    const handleMessage = (event: MessageEvent<unknown>) => {
      if (typeof event.data !== 'string') {
        return;
      }

      const eventType = getRealtimeEventType(event.data);

      if (eventType === 'data.reset') {
        resync();
        return;
      }

      if (eventType && affectsRooms(eventType)) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.roomsRoot });
      }
    };

    const connect = () => {
      if (isDisposed) {
        return;
      }

      const nextSocket = new WebSocket(getRealtimeUrl());
      socket = nextSocket;

      nextSocket.addEventListener('open', () => {
        if (isDisposed) {
          return;
        }

        setStatus('connected');
        resync();
      });
      nextSocket.addEventListener('message', handleMessage);
      nextSocket.addEventListener('error', () => nextSocket.close());
      nextSocket.addEventListener('close', () => {
        if (isDisposed || reconnectTimer !== undefined) {
          return;
        }

        setStatus('reconnecting');
        reconnectTimer = window.setTimeout(() => {
          reconnectTimer = undefined;
          connect();
        }, REALTIME_RECONNECT_DELAY_MS);
      });
    };

    connect();

    return () => {
      isDisposed = true;

      if (reconnectTimer !== undefined) {
        window.clearTimeout(reconnectTimer);
      }

      socket?.close();
    };
  }, [connectionAttempt, queryClient]);

  const reconnect = () => {
    setConnectionAttempt((current) => current + 1);
  };

  return { status, reconnect };
};
