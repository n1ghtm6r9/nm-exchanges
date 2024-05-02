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
import type { IBingxSpotHttpProvider } from '../interfaces';
import { bingxSpotHttpProviderKey, bingxSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bingxSpotHttpProviderKey) protected readonly http: IBingxSpotHttpProvider) {}

  public call = ({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/openApi/spot/v1/common/symbols',
        })
        .then(res => res.data.data.symbols.filter(v => v.status === 1)),
    ]).then(([tradePairs]) => ({
      data: tradePairs.map((tradePair): GetTradePairInfoResponseDto => {
        const [baseAsset, quoteAsset] = tradePair.symbol.split('-');
        return {
          symbol: tradePair.symbol,
          baseAsset,
          quoteAsset,
          baseAssetPrecision: getPrecision(tradePair.stepSize),
          quoteAssetPrecision: getPrecision(tradePair.tickSize),
          pricePrecision: getPrecision(tradePair.tickSize),
          makerCommissionPercent: 0.1,
          takerCommissionPercent: 0.1,
          intervals: bingxSpotIntervals,
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.BINGX,
          spot: {
            deposits: [],
            withdraws: [],
          },
        };
      }),
    }));
}
