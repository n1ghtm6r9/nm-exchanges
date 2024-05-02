import math from 'big.js';
import * as objectHash from 'object-hash';
import { Inject, Injectable } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import { CustomError } from '@nmxjs/errors';
import { getBatchesFromArray } from '@nmxjs/utils';
import {
  MarketDataStreamRequestDto,
  MarketDataStreamRequestDataOrderBookMethodDto,
  MarketDataStreamDto,
  BaseStreamService,
  MarketDataStreamOrderBookDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';

@Injectable()
export class MarketDataStreamService extends BaseStreamService<MarketDataStreamRequestDto, MarketDataStreamDto> {
  protected connectionOptions: Record<string, MarketDataStreamRequestDataOrderBookMethodDto>[] = [];

  constructor(@Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory) {
    super(webSocketFactory);
  }

  protected getKey = (options: MarketDataStreamRequestDto) => objectHash(options);

  protected getWsOptions = ({ methods }: MarketDataStreamRequestDto) =>
    getBatchesFromArray({
      arr: methods,
      size: 500,
    }).map(methodsBatch => {
      const options = methodsBatch.reduce((res: Record<string, MarketDataStreamRequestDataOrderBookMethodDto>, method) => {
        if (method.name === 'orderBook') {
          res[`${method.tradePair.baseAsset.toLowerCase()}${method.tradePair.quoteAsset.toLowerCase()}@depth20@100ms`] = method;
        }
        return res;
      }, {});

      this.connectionOptions.push(options);
      const strOptions = Object.keys(options).join('/');

      if (strOptions.length === 0) {
        throw new CustomError('Spot market data stream no options!');
      }

      return {
        getUrl: () => `wss://fstream.binance.com/stream?streams=${strOptions}`,
        reconnectAfterMs: 82800000, // 23h
      };
    });

  protected onData(data): MarketDataStreamOrderBookDto[] {
    const result: MarketDataStreamOrderBookDto[] = [];

    if (!data.stream) {
      return result;
    }

    const method = this.connectionOptions.find(options => options[data.stream])?.[data.stream];

    if (!method) {
      return result;
    }

    if (method.name === 'orderBook') {
      const mapAsksBids = ([rawPrice, rawQty]) => {
        const price = parseFloat(rawPrice);
        const volumeBaseAsset = parseFloat(rawQty);
        return {
          price,
          volumeBaseAsset: parseFloat(rawQty),
          volumeQuoteAsset: math(price).mul(volumeBaseAsset).toNumber(),
        };
      };
      result.push({
        type: 'orderBook',
        data: {
          marketType: MarketTypeEnum.FUTURES,
          provider: TradingProviderEnum.BINANCE,
          tradePair: method.tradePair,
          asks: data.data.a.map(mapAsksBids),
          bids: data.data.b.map(mapAsksBids),
          lastUpdatedId: data.data.T,
          time: undefined,
        },
      });
    }

    return result;
  }
}
