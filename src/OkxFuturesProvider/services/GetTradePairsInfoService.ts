import math from 'big.js';
import { getPrecision, sleep } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IOkxFuturesHttpProvider } from '../interfaces';
import { okxFuturesIntervals, okxFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(okxFuturesHttpProviderKey) protected readonly http: IOkxFuturesHttpProvider) {}

  public async call({ credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const [tradePairsInfo, tradeFeeInfo] = await Promise.all([
      this.http
        .request({
          url: '/api/v5/public/instruments',
          query: {
            instType: 'SWAP',
          },
        })
        .then(res => res.data.data.filter(v => v.state === 'live' && v.settleCcy !== 'USD')),
      credentials
        ? this.http
            .request({
              url: '/api/v5/account/trade-fee',
              query: {
                instType: 'SWAP',
              },
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.data[0])
        : { maker: '0', taker: '0' },
    ]);

    const data: GetTradePairInfoResponseDto[] = [];

    for (const tradePairInfo of tradePairsInfo) {
      const fundingInfo = await this.http
        .request({
          url: '/api/v5/public/funding-rate',
          query: {
            instId: tradePairInfo.instId,
          },
        })
        .then(res => res.data.data[0]);

      data.push({
        symbol: tradePairInfo.instFamily,
        baseAsset: tradePairInfo.ctValCcy,
        quoteAsset: tradePairInfo.settleCcy,
        intervals: okxFuturesIntervals,
        baseAssetPrecision: getPrecision(tradePairInfo.minSz),
        quoteAssetPrecision: getPrecision(tradePairInfo.tickSz),
        marketType: MarketTypeEnum.FUTURES,
        pricePrecision: getPrecision(tradePairInfo.tickSz),
        provider: TradingProviderEnum.OKX,
        makerCommissionPercent: math(tradeFeeInfo.maker).mul(-100).toNumber(),
        takerCommissionPercent: math(tradeFeeInfo.taker).mul(-100).toNumber(),
        futures: {
          fundingIntervalHours: math(fundingInfo.nextFundingTime).minus(fundingInfo.fundingTime).div(3600000).toNumber(),
          fundingRate: math(fundingInfo.fundingRate).mul(100).toNumber(),
          nextFundingTime: parseInt(fundingInfo.fundingTime),
        },
      });

      await sleep({ time: 101 });
    }

    return {
      data,
    };
  }
}
