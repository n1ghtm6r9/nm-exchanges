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
import type { IKrakenFuturesHttpProvider } from '../interfaces';
import { krakenFuturesIntervals, krakenFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(krakenFuturesHttpProviderKey) protected readonly http: IKrakenFuturesHttpProvider) {}

  public call = ({}: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/derivatives/api/v3/instruments',
        })
        .then(res => res.data.instruments.filter(v => v.tradeable && v.type === 'flexible_futures' && v.fundingRateCoefficient)),
      this.http
        .request({
          url: '/derivatives/api/v3/tickers',
        })
        .then(res => res.data.tickers),
      this.http
        .request({
          url: '/derivatives/api/v3/feeschedules',
        })
        .then(res => res.data.feeSchedules),
    ]).then(([tradePairsInfo, fundingInfos, feesInfo]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const feeInfo = feesInfo.find(v => v.uid === tradePairInfo.feeScheduleUid).tiers[0];
        const fundingInfo = fundingInfos.find(v => v.symbol === tradePairInfo.symbol);
        const fundingIntervalHours = math(24).div(tradePairInfo.fundingRateCoefficient).toNumber();
        const currentHours = moment().hours();
        let nextFundingTime: number;

        for (let i = fundingIntervalHours; i <= 24; i += fundingIntervalHours) {
          if (currentHours < i) {
            nextFundingTime = moment().hours(i).minutes(0).seconds(0).milliseconds(0).valueOf();
            break;
          }
        }

        return {
          symbol: tradePairInfo.symbol,
          baseAsset: tradePairInfo.symbol.replace('PF_', '').replace('USD', ''),
          quoteAsset: 'USD',
          baseAssetPrecision: getPrecision(tradePairInfo.contractSize),
          quoteAssetPrecision: getPrecision(tradePairInfo.tickSize),
          pricePrecision: getPrecision(tradePairInfo.tickSize),
          makerCommissionPercent: feeInfo.makerFee,
          takerCommissionPercent: feeInfo.takerFee,
          intervals: krakenFuturesIntervals,
          marketType: MarketTypeEnum.FUTURES,
          provider: TradingProviderEnum.KRAKEN,
          futures: {
            nextFundingTime,
            fundingIntervalHours,
            fundingRate: math(fundingInfo.fundingRate).mul(100).div(fundingInfo.indexPrice).toNumber(),
          },
        };
      }),
    }));
}
