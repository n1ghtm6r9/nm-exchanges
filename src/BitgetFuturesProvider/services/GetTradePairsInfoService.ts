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
import type { IBitgetFuturesHttpProvider } from '../interfaces';
import { bitgetFuturesIntervals, bitgetFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bitgetFuturesHttpProviderKey) protected readonly http: IBitgetFuturesHttpProvider) {}

  public async call({}: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const tradePairsInfo = await Promise.all(
      ['umcbl', 'cmcbl'].map(productType =>
        this.http
          .request({
            url: '/api/mix/v1/market/contracts',
            query: {
              productType,
            },
          })
          .then(res => res.data.data),
      ),
    ).then(res => res.flat());

    const data: GetTradePairInfoResponseDto[] = [];

    for (const tradePairInfo of tradePairsInfo) {
      const [fundingRate, fundingTimeInfo] = await Promise.all([
        this.http
          .request({
            url: '/api/mix/v1/market/current-fundRate',
            query: {
              symbol: tradePairInfo.symbol,
            },
          })
          .then(res => res.data.data.fundingRate),
        this.http
          .request({
            url: '/api/mix/v1/market/funding-time',
            query: {
              symbol: tradePairInfo.symbol,
            },
          })
          .then(res => res.data.data),
      ]);

      data.push({
        symbol: tradePairInfo.symbol,
        baseAsset: tradePairInfo.baseCoin,
        quoteAsset: tradePairInfo.quoteCoin,
        baseAssetPrecision: getPrecision(parseFloat(tradePairInfo.minTradeNum)),
        quoteAssetPrecision: getPrecision(parseFloat(tradePairInfo.minTradeNum)),
        pricePrecision: parseInt(tradePairInfo.pricePlace),
        intervals: bitgetFuturesIntervals,
        makerCommissionPercent: math(tradePairInfo.makerFeeRate).mul(100).toNumber(),
        takerCommissionPercent: math(tradePairInfo.takerFeeRate).mul(100).toNumber(),
        marketType: MarketTypeEnum.FUTURES,
        provider: TradingProviderEnum.BITGET,
        futures: {
          fundingRate: math(fundingRate).mul(100).toNumber(),
          fundingIntervalHours: parseInt(fundingTimeInfo.ratePeriod),
          nextFundingTime: parseInt(fundingTimeInfo.fundingTime),
        },
      });

      await sleep(101);
    }

    return {
      data,
    };
  }
}
