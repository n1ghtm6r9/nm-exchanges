import math from 'big.js';
import { getPrecision } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBybitFuturesHttpProvider } from '../interfaces';
import { bybitFuturesIntervals, bybitFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bybitFuturesHttpProviderKey) protected readonly http: IBybitFuturesHttpProvider) {}

  public call = ({ credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/v5/market/instruments-info',
          query: {
            category: 'linear',
            limit: 1000,
          },
        })
        .then(res => res.data.result.list.filter(v => v.status === 'Trading' && v.contractType === 'LinearPerpetual')),
      this.http
        .request({
          url: '/v5/market/tickers',
          query: {
            category: 'linear',
          },
        })
        .then(res => res.data.result.list),
      credentials
        ? this.http
            .request({
              url: '/v5/account/fee-rate',
              query: {
                category: 'linear',
              },
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.result.list)
        : [],
    ]).then(([tradePairsInfo, fundingInfos, commissionsInfo]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const fundingInfo = fundingInfos.find(v => v.symbol === tradePairInfo.symbol);
        const commissionInfo = commissionsInfo.find(v => v.symbol === tradePairInfo.symbol);
        return {
          symbol: tradePairInfo.symbol,
          baseAsset: tradePairInfo.baseCoin,
          quoteAsset: tradePairInfo.quoteCoin,
          intervals: bybitFuturesIntervals,
          baseAssetPrecision: getPrecision(parseFloat(tradePairInfo.lotSizeFilter.qtyStep)),
          quoteAssetPrecision: getPrecision(parseFloat(tradePairInfo.priceFilter.tickSize)),
          pricePrecision: getPrecision(parseFloat(tradePairInfo.priceFilter.tickSize)),
          makerCommissionPercent: commissionInfo ? math(commissionInfo.makerFeeRate).mul(100).toNumber() : 0,
          takerCommissionPercent: commissionInfo ? math(commissionInfo.takerFeeRate).mul(100).toNumber() : 0,
          marketType: MarketTypeEnum.FUTURES,
          provider: TradingProviderEnum.BYBIT,
          futures: {
            nextFundingTime: parseFloat(fundingInfo.nextFundingTime),
            fundingRate: math(fundingInfo.fundingRate).mul(100).toNumber(),
            fundingIntervalHours: math(tradePairInfo.fundingInterval).div(60).toNumber(),
          },
        };
      }),
    }));
}
