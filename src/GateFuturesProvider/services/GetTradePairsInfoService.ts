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
import type { IGateFuturesHttpProvider } from '../interfaces';
import { gateFuturesIntervals, gateFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(gateFuturesHttpProviderKey) protected readonly http: IGateFuturesHttpProvider) {}

  public call = ({}: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    this.http
      .request({
        url: '/api/v4/futures/usdt/contracts',
      })
      .then(res => res.data.filter(v => !v.in_delisting))
      .then(tradePairsInfo => ({
        data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
          const [baseAsset, quoteAsset] = tradePairInfo.name.split('_');
          return {
            symbol: tradePairInfo.name,
            baseAsset,
            quoteAsset,
            intervals: gateFuturesIntervals,
            baseAssetPrecision: getPrecision(parseFloat(tradePairInfo.quanto_multiplier)),
            quoteAssetPrecision: getPrecision(parseFloat(tradePairInfo.order_price_round)),
            pricePrecision: getPrecision(parseFloat(tradePairInfo.order_price_round)),
            makerCommissionPercent: math(tradePairInfo.maker_fee_rate).mul(100).toNumber(),
            takerCommissionPercent: math(tradePairInfo.taker_fee_rate).mul(100).toNumber(),
            marketType: MarketTypeEnum.FUTURES,
            provider: TradingProviderEnum.GATE,
            futures: {
              fundingRate: math(tradePairInfo.funding_rate).mul(100).toNumber(),
              nextFundingTime: math(tradePairInfo.funding_next_apply).mul(1000).toNumber(),
              fundingIntervalHours: math(tradePairInfo.funding_interval).div(3600).toNumber(),
            },
          };
        }),
      }));
}
