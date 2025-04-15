import math from 'big.js';
import { sleep } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBingxFuturesHttpProvider } from '../interfaces';
import { bingxFuturesIntervals, bingxFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bingxFuturesHttpProviderKey) protected readonly http: IBingxFuturesHttpProvider) {}

  public async call({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const [tradePairs, fundingInfos] = await Promise.all([
      this.http
        .request({
          url: '/openApi/swap/v2/quote/contracts',
        })
        .then(res => res.data.data.filter(v => v.status === 1)),
      this.http
        .request({
          url: '/openApi/swap/v2/quote/premiumIndex',
        })
        .then(res => res.data.data),
    ]);

    const data: GetTradePairInfoResponseDto[] = [];

    for (const tradePair of tradePairs) {
      const fundingIntervalHours = await this.http
        .request({
          url: '/openApi/swap/v2/quote/fundingRate',
          query: {
            limit: 2,
            symbol: tradePair.symbol,
          },
        })
        .then(res =>
          !res.data.data[0] || !res.data.data[1] ? 8 : math(res.data.data[0].fundingTime).minus(res.data.data[1].fundingTime).div(3600000).toNumber(),
        );

      const fundingInfo = fundingInfos.find(v => v.symbol === tradePair.symbol);
      data.push({
        symbol: tradePair.symbol,
        baseAsset: tradePair.asset,
        quoteAsset: tradePair.currency,
        baseAssetPrecision: tradePair.quantityPrecision,
        quoteAssetPrecision: tradePair.pricePrecision,
        pricePrecision: tradePair.pricePrecision,
        makerCommissionPercent: 0.02,
        takerCommissionPercent: math(tradePair.feeRate).mul(100).toNumber(),
        intervals: bingxFuturesIntervals,
        marketType: MarketTypeEnum.FUTURES,
        provider: TradingProviderEnum.BINGX,
        futures: {
          fundingIntervalHours,
          nextFundingTime: fundingInfo.nextFundingTime,
          fundingRate: math(fundingInfo.lastFundingRate).mul(100).toNumber(),
        },
      });

      await sleep(101);
    }

    return {
      data,
    };
  }
}
