import math from 'big.js';
import * as objectHash from 'object-hash';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import { getBatchesFromArray, uuid } from '@nmxjs/utils';
import {
  BaseStreamService,
  MarketDataStreamRequestDto,
  MarketDataStreamRequestMethodDto,
  IOnDataOptions,
  MarketDataStreamDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IKucoinSpotHttpProvider } from '../interfaces';
import { kucoinSpotHttpProviderKey } from '../constants';

@Injectable()
export class MarketDataStreamService extends BaseStreamService<MarketDataStreamRequestDto, MarketDataStreamDto> {
  protected connectionOptions: Record<string, MarketDataStreamRequestMethodDto>[] = [];

  constructor(
    @Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory,
    @Inject(kucoinSpotHttpProviderKey) protected readonly http: IKucoinSpotHttpProvider,
  ) {
    super(webSocketFactory);
  }

  protected getKey = (options: MarketDataStreamRequestDto) => objectHash(options);

  protected getWsOptions = ({ methods }: MarketDataStreamRequestDto) =>
    getBatchesFromArray({
      size: 300,
      arr: methods.filter(v => v.name === 'orderBook').map(v => `${v.tradePair.baseAsset}-${v.tradePair.quoteAsset}`),
    }).map(methodsBatch => ({
      getUrl: () =>
        this.http.request({ url: '/api/v1/bullet-public', method: 'POST' }).then(res => {
          const token = res.data.data.token;
          const url = res.data.data.instanceServers[0].endpoint;
          const id = uuid();
          return `${url}/?token=${token}&connectId=${id}`;
        }),
      meta: methodsBatch,
    }));

  protected onData({ data, meta, client }: IOnDataOptions<string[]>): MarketDataStreamDto[] {
    const result: MarketDataStreamDto[] = [];

    if (data.type === 'error') {
      Logger.error(`Kucoin ws error: ${JSON.stringify(data)}`);
    }

    if (data.type === 'welcome') {
      getBatchesFromArray({
        size: 100,
        arr: meta,
      }).forEach(v => {
        client.send(
          JSON.stringify({
            id: data.id,
            type: 'subscribe',
            topic: `/spotMarket/level2Depth50:${v.join(',')}`,
          }),
        );
      });
    }

    if (data.type === 'message' && data.topic.includes('/spotMarket/level2Depth50')) {
      const [baseAsset, quoteAsset] = data.topic.substring(26).split('-');
      const mapAsksBids = ([rawPrice, rawQty]) => {
        const price = parseFloat(rawPrice);
        const volumeBaseAsset = parseFloat(rawQty);
        return {
          price,
          volumeBaseAsset,
          volumeQuoteAsset: math(price).mul(volumeBaseAsset).toNumber(),
        };
      };

      result.push({
        type: 'orderBook',
        data: {
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.KUCOIN,
          tradePair: {
            baseAsset,
            quoteAsset,
          },
          asks: data.data.asks.map(mapAsksBids),
          bids: data.data.bids.map(mapAsksBids),
          lastUpdatedId: data.data.timestamp,
          time: data.data.timestamp,
        },
      });
    }

    return result;
  }
}
