import { uuid } from '@nmxjs/utils';
import { type IWebSocketFactory, WsEventTypeEnum } from '@nmxjs/ws';
import {
  IStreamsData,
  IOnDataOptions,
  IStreamConnectToWsEvent,
  IStreamDelayPingWsEvent,
  IBaseStreamServiceResult,
  IWebSocketClientOptionsWithMeta,
  IStreamSubscriberListener,
} from '../interfaces';

export abstract class BaseStreamService<I extends { onData: (data: T) => void }, T> {
  protected streams: Record<string, IStreamsData> = {};

  constructor(protected readonly webSocketFactory: IWebSocketFactory) {}

  protected abstract getKey(options: I): string;
  protected abstract getWsOptions(options: I): IWebSocketClientOptionsWithMeta[];
  protected abstract onData(options: IOnDataOptions<any>): T[];

  public async call(options: I): Promise<IBaseStreamServiceResult> {
    const id = uuid();
    const key = this.getKey(options);
    let isUnsubscribe = false;
    const connectToWsEvent: IStreamConnectToWsEvent = {
      type: 'connectToWs',
    };

    const delayPingWsWsEvent: IStreamDelayPingWsEvent = {
      type: 'delayPingWs',
    };

    const listeners: IStreamSubscriberListener[] = [];

    if (!this.streams[key]) {
      const connections = await Promise.all(
        this.getWsOptions(options).map(async (v, i) => {
          const { meta, ...wsOptions } = v;
          const connection = this.webSocketFactory.create(wsOptions);
          listeners.push(
            ...[
              {
                id: connection.addListener({
                  cb: data => {
                    this.onData({
                      data,
                      meta,
                      client: connection.getClient(),
                    })?.forEach(v => {
                      options.onData(v);
                    });
                  },
                  type: WsEventTypeEnum.DATA,
                }).id,
                connectionIndex: i,
              },
              {
                id: connection.addListener({
                  cb: () => {
                    this.onData({
                      data: connectToWsEvent,
                      meta,
                      client: connection.getClient(),
                    })?.forEach(v => {
                      options.onData(v);
                    });
                  },
                  type: WsEventTypeEnum.AFTER_CONNECT,
                }).id,
                connectionIndex: i,
              },
              {
                id: connection.addListener({
                  cb: () => {
                    this.onData({
                      data: delayPingWsWsEvent,
                      meta,
                      client: connection.getClient(),
                    })?.forEach(v => {
                      options.onData(v);
                    });
                  },
                  type: WsEventTypeEnum.NETWORK_DELAY,
                }).id,
                connectionIndex: i,
              },
            ]
          );
          await connection.connect();
          return {
            meta,
            connection,
          };
        })
      );

      if (!connections || !connections.length) {
        return;
      }

      if (isUnsubscribe) {
        connections.forEach(({ connection }) => {
          connection.close();
        });
        return;
      }

      options.onData(<T>connectToWsEvent);

      this.streams[key] = {
        connections,
        subscribers: [],
      };
    }

    this.streams[key].subscribers.push({
      id,
      listeners,
    });

    return {
      close: async () => {
        isUnsubscribe = true;

        if (!this.streams[key]) {
          return;
        }

        const subscriberIndex = this.streams[key].subscribers.findIndex(v => v.id === id);

        if (subscriberIndex !== -1) {
          const [subscriber] = this.streams[key].subscribers.splice(subscriberIndex, 1);
          subscriber.listeners.forEach(listenerData => [
            this.streams[key].connections[listenerData.connectionIndex].connection.removeListener({
              id: listenerData.id,
            }),
          ]);
        }

        if (this.streams[key].subscribers.length !== 0) {
          return;
        }

        this.streams[key].connections.forEach(({ connection }) => {
          connection.close();
        });

        this.streams[key] = undefined;
      },
    };
  }
}
