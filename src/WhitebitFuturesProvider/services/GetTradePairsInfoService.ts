import math from 'big.js';
import moment from 'moment';
import { getPrecision } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IWhitebitFuturesHttpProvider } from '../interfaces';
import { whitebitFuturesIntervals, whitebitFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(whitebitFuturesHttpProviderKey) protected readonly http: IWhitebitFuturesHttpProvider) {}

  public call = ({}: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/api/v4/public/markets',
        })
        .then(res => res.data.filter(v => v.type === 'futures' && v.tradesEnabled)),
      this.http
        .request({
          url: '/api/v4/public/futures',
        })
        .then(res => res.data.result),
    ]).then(([tradePairsInfo, fundingInfos]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const fundingInfo = fundingInfos.find(v => v.ticker_id === tradePairInfo.name);
        return {
          symbol: tradePairInfo.name,
          baseAsset: tradePairInfo.stock,
          quoteAsset: tradePairInfo.money,
          baseAssetPrecision: parseFloat(tradePairInfo.stockPrec),
          quoteAssetPrecision: parseFloat(tradePairInfo.moneyPrec),
          pricePrecision: parseFloat(tradePairInfo.moneyPrec),
          intervals: whitebitFuturesIntervals,
          makerCommissionPercent: parseFloat(tradePairInfo.makerFee),
          takerCommissionPercent: parseFloat(tradePairInfo.takerFee),
          marketType: MarketTypeEnum.FUTURES,
          provider: TradingProviderEnum.WHITEBIT,
          futures: {
            fundingIntervalHours: 8,
            fundingRate: math(fundingInfo.funding_rate).mul(100).toNumber(),
            nextFundingTime: parseInt(fundingInfo.next_funding_rate_timestamp),
          },
        };
      }),
    }));
}
