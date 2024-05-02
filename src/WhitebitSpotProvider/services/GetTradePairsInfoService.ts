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
import type { IWhiteSpotHttpProvider } from '../interfaces';
import { whitebitSpotHttpProviderKey, whitebitSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(whitebitSpotHttpProviderKey) protected readonly http: IWhiteSpotHttpProvider) {}

  public call = ({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/api/v4/public/markets',
        })
        .then(res => res.data.filter(v => v.type === 'spot' && v.tradesEnabled)),
    ]).then(([tradePairsInfo]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        return {
          symbol: tradePairInfo.name,
          baseAsset: tradePairInfo.stock,
          quoteAsset: tradePairInfo.money,
          baseAssetPrecision: parseFloat(tradePairInfo.stockPrec),
          quoteAssetPrecision: parseFloat(tradePairInfo.moneyPrec),
          pricePrecision: parseFloat(tradePairInfo.moneyPrec),
          intervals: whitebitSpotIntervals,
          makerCommissionPercent: parseFloat(tradePairInfo.makerFee),
          takerCommissionPercent: parseFloat(tradePairInfo.takerFee),
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.WHITEBIT,
          spot: {
            // TODO /api/v4/public/assets
            deposits: [],
            withdraws: [],
            // TODO /api/v4/main-account/smart/plans
            ...(tradePairInfo.isCollateral
              ? {
                  margin: {
                    borrowLimit: 0,
                    hourlyInterestPercent: 0.0024375,
                  },
                }
              : {}),
          },
        };
      }),
    }));
}
