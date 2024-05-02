import type { IStreamSubscriber } from './IStreamSubscriber';
import { IWebSocketConnectionWithMeta } from './IWebSocketConnectionWithMeta';

export interface IStreamsData {
  connections: IWebSocketConnectionWithMeta[];
  subscribers: IStreamSubscriber[];
}
