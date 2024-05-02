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
import type { IKucoinFuturesHttpProvider } from '../interfaces';
import { kucoinFuturesIntervals, kucoinFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(kucoinFuturesHttpProviderKey) protected readonly http: IKucoinFuturesHttpProvider) {}

  public call = ({}: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    this.http
      .request({
        url: '/api/v1/contracts/active',
      })
      .then(res => ({
        data: res.data.data
          .filter(v => v.status === 'Open' && v.quoteCurrency !== 'USD')
          .map(
            (v): GetTradePairInfoResponseDto => ({
              symbol: v.symbol,
              baseAsset: v.baseCurrency === 'XBT' ? 'BTC' : v.baseCurrency,
              quoteAsset: v.quoteCurrency,
              intervals: kucoinFuturesIntervals,
              marketType: MarketTypeEnum.FUTURES,
              provider: TradingProviderEnum.KUCOIN,
              makerCommissionPercent: math(v.makerFeeRate).mul(100).toNumber(),
              takerCommissionPercent: math(v.takerFeeRate).mul(100).toNumber(),
              baseAssetPrecision: getPrecision(math(v.lotSize).mul(v.multiplier).toNumber()),
              quoteAssetPrecision: 2,
              pricePrecision: getPrecision(v.tickSize),
              futures: {
                fundingRate: math(v.fundingFeeRate).mul(100).toNumber(),
                fundingIntervalHours: parseInt(v.fundingBaseSymbol.substring(v.fundingBaseSymbol1M.length).replace('H', '')),
                nextFundingTime: moment().add(v.nextFundingRateTime).minutes(0).seconds(0).milliseconds(0).valueOf(),
              },
            }),
          ),
      }));
}
