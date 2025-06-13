import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../store';
import { TWsActions } from '../../utils/types';

export const socketMiddleware = (wsActions: TWsActions): Middleware =>
  ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;

    return (next) => (action: any) => {
      const { dispatch } = store;
      const { type, payload } = action;
      const { wsInit, wsClose, onOpen, onClose, onError, onMessage } =
        wsActions;

      if (type === wsInit) {
        socket = new WebSocket(payload);
      }

      if (socket && type === wsClose) {
        socket.close();
      }

      if (socket) {
        socket.onopen = () => {
          dispatch({ type: onOpen });
        };

        socket.onerror = () => {
          dispatch({ type: onError, payload: 'WebSocket error' });
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          dispatch({ type: onMessage, payload: data });
        };

        socket.onclose = () => {
          dispatch({ type: onClose });
        };
      }

      next(action);
    };
  }) as Middleware;
