import math from 'big.js';
import * as objectHash from 'object-hash';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import { getBatchesFromArray } from '@nmxjs/utils';
import {
  BaseStreamService,
  MarketDataStreamRequestDto,
  IOnDataOptions,
  MarketDataStreamDto,
  MarketTypeEnum,
  SimpleTradePairDto,
  TradingProviderEnum,
} from '../../ExchangesProvider';

@Injectable()
export class MarketDataStreamService extends BaseStreamService<MarketDataStreamRequestDto, MarketDataStreamDto> {
  constructor(@Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory) {
    super(webSocketFactory);
  }

  protected getKey = (options: MarketDataStreamRequestDto) => objectHash(options);

  protected getWsOptions = ({ methods }: MarketDataStreamRequestDto) =>
    getBatchesFromArray({
      size: 30,
      arr: methods,
    }).map(methodsBatch => {
      return {
        getUrl: () => 'wss://wbs.mexc.com/ws',
        reconnectAfterMs: 82800000, // 23h
        meta: methodsBatch.reduce((res, item) => {
          res[`${item.tradePair.baseAsset}${item.tradePair.quoteAsset}`] = item.tradePair;
          return res;
        }, {}),
      };
    });

  protected onData({ data, meta, client }: IOnDataOptions<Record<string, SimpleTradePairDto>>): MarketDataStreamDto[] {
    const result: MarketDataStreamDto[] = [];

    if (data.type === 'connectToWs') {
      getBatchesFromArray({ arr: Object.keys(meta), size: 15 }).forEach(v => {
        client.send(
          JSON.stringify({
            method: 'SUBSCRIPTION',
            params: v.map(v => `spot@public.limit.depth.v3.api@${v}@20`),
          }),
        );
      });
    } else if (data.msg && ['msg length invalid', 'no subscription success'].includes(data.msg)) {
      Logger.error(`Mexc ws error: ${JSON.stringify(data)}`);
    } else if (data.d && data.d.e === 'spot@public.limit.depth.v3.api') {
      const mapAsksBids = obj => {
        const price = parseFloat(obj.p);
        const volumeBaseAsset = parseFloat(obj.v);
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
          provider: TradingProviderEnum.MEXC,
          tradePair: meta[data.s],
          asks: data.d.asks.map(mapAsksBids),
          bids: data.d.bids.map(mapAsksBids),
          lastUpdatedId: parseFloat(data.d.r),
          time: data.t,
        },
      });
    }

    return result;
  }
}
