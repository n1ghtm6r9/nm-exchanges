import math from 'big.js';
import * as objectHash from 'object-hash';
import { Inject, Injectable } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import { CustomError } from '@nmxjs/errors';
import { getBatchesFromArray } from '@nmxjs/utils';
import {
  BaseStreamService,
  MarketDataStreamRequestDto,
  MarketDataStreamRequestMethodDto,
  IOnDataOptions,
  MarketDataStreamDto,
  MarketTypeEnum,
  TradingOrderSideEnum,
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
      size: 500,
      arr: methods,
    }).map(methodsBatch => {
      const options = methodsBatch.reduce((res: Record<string, MarketDataStreamRequestMethodDto>, method) => {
        if (method.name === 'orderBook') {
          res[`${method.tradePair.baseAsset.toLowerCase()}${method.tradePair.quoteAsset.toLowerCase()}@depth20@100ms`] = method;
        } else if (method.name === 'aggregateTrade') {
          res[`${method.tradePair.baseAsset.toLowerCase()}${method.tradePair.quoteAsset.toLowerCase()}@aggTrade`] = method;
        }
        return res;
      }, {});

      const strOptions = Object.keys(options).join('/');

      if (strOptions.length === 0) {
        throw new CustomError('Spot market data stream no options!');
      }

      return {
        getUrl: () => `wss://data-stream.binance.vision/stream?streams=${strOptions}`,
        reconnectAfterMs: 82800000, // 23h
        meta: options,
      };
    });

  protected onData({ data, meta }: IOnDataOptions<Record<string, MarketDataStreamRequestMethodDto>>): MarketDataStreamDto[] {
    const result: MarketDataStreamDto[] = [];

    if (!data.stream) {
      return result;
    }

    const method = meta[data.stream];

    if (!method) {
      return result;
    }

    if (method.name === 'orderBook') {
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
          provider: TradingProviderEnum.BINANCE,
          tradePair: method.tradePair,
          asks: data.data.asks.map(mapAsksBids),
          bids: data.data.bids.map(mapAsksBids),
          lastUpdatedId: data.data.lastUpdateId,
          time: Date.now(),
        },
      });
    } else if (method.name === 'aggregateTrade') {
      result.push({
        type: 'aggregateTrade',
        data: {
          tradePair: method.tradePair,
          price: parseFloat(data.data.p),
          quantity: parseFloat(data.data.q),
          side: data.data.m ? TradingOrderSideEnum.SELL : TradingOrderSideEnum.BUY,
          provider: TradingProviderEnum.BINANCE,
        },
      });
    }

    return result;
  }
}
