import math from 'big.js';
import { getPrecision, getBatchesFromArray, sleep } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBitfinexSpotHttpProvider } from '../interfaces';
import { bitfinexSpotHttpProviderKey, bitfinexSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bitfinexSpotHttpProviderKey) protected readonly http: IBitfinexSpotHttpProvider) {}

  public async call({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const [tradePairs, currencies, mapCurrencies] = await Promise.all([
      this.http
        .request({
          url: '/v2/conf/pub:list:pair:exchange',
        })
        .then(res => res.data[0].filter(v => !v.includes('TEST') && !v.includes('2X'))),
      this.http
        .request({
          url: '/v2/conf/pub:list:currency',
        })
        .then(res => res.data[0]),
      this.http
        .request({
          url: '/v2/conf/pub:map:currency:sym',
        })
        .then(res => res.data[0]),
    ]);

    const data: GetTradePairInfoResponseDto[] = [];

    for (const tradePair of tradePairs) {
      let [baseAsset, quoteAsset] = tradePair.split(':');

      if (!quoteAsset) {
        const currency = currencies.find(s => tradePair.includes(s));
        const lastIndexOf = tradePair.lastIndexOf(currency);
        baseAsset = lastIndexOf === 0 ? currency : tradePair.substring(0, lastIndexOf);
        quoteAsset = lastIndexOf !== 0 ? currency : tradePair.substring(currency.length);
      }

      baseAsset = (mapCurrencies.find(v => v[0] === baseAsset)?.[1] || baseAsset).toUpperCase();
      quoteAsset = (mapCurrencies.find(v => v[0] === quoteAsset)?.[1] || quoteAsset).toUpperCase();

      data.push({
        symbol: tradePair,
        baseAsset,
        quoteAsset,
        baseAssetPrecision: 8,
        quoteAssetPrecision: 5,
        pricePrecision: 5,
        intervals: bitfinexSpotIntervals,
        makerCommissionPercent: 0.1,
        takerCommissionPercent: 0.2,
        marketType: MarketTypeEnum.SPOT,
        provider: TradingProviderEnum.BITFINEX,
        spot: {
          deposits: [],
          withdraws: [],
        },
      });
    }

    return {
      data,
    };
  }
}
