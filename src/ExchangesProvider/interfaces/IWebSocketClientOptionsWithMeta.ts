import { IWebSocketClientOptions } from '@nmxjs/ws';

export interface IWebSocketClientOptionsWithMeta extends IWebSocketClientOptions {
  meta?: object;
}
