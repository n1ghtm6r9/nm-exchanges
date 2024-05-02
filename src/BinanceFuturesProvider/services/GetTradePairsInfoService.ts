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
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesIntervals, binanceFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  protected readonly timeoutMs = 60000;

  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public call = ({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/fapi/v1/exchangeInfo',
          timeoutMs: this.timeoutMs,
          headers: {
            proxy,
          },
        })
        .then(response => response.data.symbols),
      this.http
        .request({
          url: '/fapi/v1/premiumIndex',
          timeoutMs: this.timeoutMs,
        })
        .then(res => res.data),
      this.http
        .request({
          url: '/fapi/v1/fundingInfo',
          timeoutMs: this.timeoutMs,
        })
        .then(res => res.data),
      credentials
        ? Promise.all(
            ['BUSD', 'USDT'].map(asset =>
              this.http
                .request({
                  url: '/fapi/v1/commissionRate',
                  query: {
                    symbol: `BTC${asset}`,
                  },
                  timeoutMs: this.timeoutMs,
                  headers: {
                    ...credentials,
                  },
                })
                .then(res => ({
                  asset,
                  makerCommissionPercent: math(parseFloat(res.data.makerCommissionRate)).mul(100).toNumber(),
                  takerCommissionPercent: math(parseFloat(res.data.takerCommissionRate)).mul(100).toNumber(),
                })),
            ),
          )
        : [],
    ]).then(([tradePairsInfo, fundingRates, dynamicFundingRatesIntervals, commissions]) => ({
      data: tradePairsInfo
        .filter(s => s.status === 'TRADING' && !s.symbol.includes('_') && s.quoteAsset !== 'USD')
        .map((tradePairInfo): GetTradePairInfoResponseDto => {
          const commission = commissions.find(v => v.asset === tradePairInfo.quoteAsset);
          const fundingRateInfo = fundingRates.find(v => v.symbol === tradePairInfo.symbol);
          const fundingRateIntervalInfo = dynamicFundingRatesIntervals.find(v => v.symbol === tradePairInfo.symbol);
          return {
            symbol: tradePairInfo.symbol,
            provider: TradingProviderEnum.BINANCE,
            marketType: MarketTypeEnum.FUTURES,
            baseAsset: tradePairInfo.baseAsset,
            quoteAsset: tradePairInfo.quoteAsset,
            intervals: binanceFuturesIntervals,
            pricePrecision: getPrecision(parseFloat(tradePairInfo.filters.find(f => f.filterType === 'PRICE_FILTER').tickSize)),
            baseAssetPrecision: getPrecision(parseFloat(tradePairInfo.filters.find(f => f.filterType === 'LOT_SIZE').stepSize)),
            quoteAssetPrecision: tradePairInfo.quotePrecision,
            makerCommissionPercent: commission?.makerCommissionPercent || 0,
            takerCommissionPercent: commission?.takerCommissionPercent || 0,
            futures: {
              fundingRate: math(fundingRateInfo.lastFundingRate).mul(100).toNumber(),
              fundingIntervalHours: fundingRateIntervalInfo?.fundingIntervalHours || 8,
              nextFundingTime: fundingRateInfo.nextFundingTime,
            },
          };
        }),
    }));
}
