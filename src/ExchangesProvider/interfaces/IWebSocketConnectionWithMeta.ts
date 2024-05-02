import { IWebSocketClient } from '@nmxjs/ws';

export interface IWebSocketConnectionWithMeta {
  connection: IWebSocketClient;
  meta?: any;
}
