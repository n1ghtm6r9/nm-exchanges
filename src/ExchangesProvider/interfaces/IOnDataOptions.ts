import type { WebSocket } from 'ws';

export interface IOnDataOptions<M> {
  data: any;
  meta?: M;
  client: WebSocket;
}
