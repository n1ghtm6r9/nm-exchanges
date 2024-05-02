import math from 'big.js';
import moment from 'moment';
import { getBatchesFromArray, getPrecision } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBitfinexFuturesHttpProvider } from '../interfaces';
import { bitfinexFuturesIntervals, bitfinexFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bitfinexFuturesHttpProviderKey) protected readonly http: IBitfinexFuturesHttpProvider) {}

  public async call({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const [tradePairs, currencies, mapCurrencies] = await Promise.all([
      this.http
        .request({
          url: '/v2/conf/pub:list:pair:futures',
        })
        .then(res => res.data[0].filter(v => !v.includes('TEST'))),
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

    const batchTradePairs = getBatchesFromArray({
      arr: tradePairs,
      size: 100,
    });

    for (const items of batchTradePairs) {
      const fundingInfos = await this.http
        .request({
          url: '/v2/status/deriv',
          query: {
            keys: items.map((tradePair: string) => `t${tradePair}`).join(','),
          },
        })
        .then(res => res.data);

      data.push(
        ...items.map((tradePair: string) => {
          let clearTradePair = tradePair.replace(/F0/g, '');
          let [baseAsset, quoteAsset] = clearTradePair.split(':');

          if (!quoteAsset) {
            const currency = currencies.find(s => clearTradePair.includes(s));
            const lastIndexOf = clearTradePair.lastIndexOf(currency);
            baseAsset = lastIndexOf === 0 ? currency : clearTradePair.substring(0, lastIndexOf);
            quoteAsset = lastIndexOf !== 0 ? currency : clearTradePair.substring(currency.length);
          }

          baseAsset = (mapCurrencies.find(v => v[0] === baseAsset)?.[1] || baseAsset).toUpperCase();
          quoteAsset = (mapCurrencies.find(v => v[0] === quoteAsset)?.[1] || quoteAsset).toUpperCase();

          const fundingInfo = fundingInfos.find(v => v[0] === `t${tradePair}`);

          return {
            symbol: tradePair,
            baseAsset,
            quoteAsset,
            baseAssetPrecision: 8,
            quoteAssetPrecision: 5,
            pricePrecision: 5,
            intervals: bitfinexFuturesIntervals,
            makerCommissionPercent: 0.02,
            takerCommissionPercent: 0.065,
            marketType: MarketTypeEnum.FUTURES,
            provider: TradingProviderEnum.BITFINEX,
            futures: {
              fundingIntervalHours: 8,
              nextFundingTime: fundingInfo[8],
              fundingRate: math(fundingInfo[12]).mul(100).toNumber(),
            },
          };
        }),
      );
    }

    return {
      data,
    };
  }
}
