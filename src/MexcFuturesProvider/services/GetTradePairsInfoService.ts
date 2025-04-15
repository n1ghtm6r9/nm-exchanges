import * as math from 'big.js';
import { getPrecision, sleep } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import type { IMexcFuturesHttpProvider } from '../interfaces';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import { mexcFuturesIntervals, mexcFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(mexcFuturesHttpProviderKey) protected readonly http: IMexcFuturesHttpProvider) {}

  public async call({ proxy }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const tradePairInfos = await this.http
      .request({
        url: '/api/v1/contract/detail',
        headers: {
          proxy,
        },
      })
      .then(res => res.data.data);

    const data: GetTradePairInfoResponseDto[] = [];

    for (const tradePairInfo of tradePairInfos) {
      const fundingInfo = await this.http
        .request({
          url: `/api/v1/contract/funding_rate/${tradePairInfo.symbol}`,
        })
        .then(res => res.data.data);

      data.push({
        symbol: tradePairInfo.symbol,
        provider: TradingProviderEnum.MEXC,
        marketType: MarketTypeEnum.FUTURES,
        baseAsset: tradePairInfo.baseCoinName,
        quoteAsset: tradePairInfo.quoteCoinName,
        intervals: mexcFuturesIntervals,
        pricePrecision: getPrecision(tradePairInfo.priceUnit),
        baseAssetPrecision: getPrecision(tradePairInfo.contractSize),
        quoteAssetPrecision: tradePairInfo.amountScale,
        makerCommissionPercent: math(tradePairInfo.makerFeeRate).mul(100).toNumber(),
        takerCommissionPercent: math(tradePairInfo.takerFeeRate).mul(100).toNumber(),
        futures: {
          fundingRate: math(fundingInfo.fundingRate).mul(100).toNumber(),
          fundingIntervalHours: fundingInfo.collectCycle,
          nextFundingTime: fundingInfo.nextSettleTime,
        },
      });

      await sleep(101);
    }

    return {
      data,
    };
  }
}
