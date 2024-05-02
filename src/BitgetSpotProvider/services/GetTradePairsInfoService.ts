import math from 'big.js';
import { getPrecision, sleep } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  DepositInfoDto,
  MarketTypeEnum,
  TradingProviderEnum,
  WithdrawInfoDto,
} from '../../ExchangesProvider';
import type { IBitgetSpotHttpProvider } from '../interfaces';
import { bitgetSpotHttpProviderKey, bitgetSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bitgetSpotHttpProviderKey) protected readonly http: IBitgetSpotHttpProvider) {}

  public async call({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const [tradePairsInfo, marginTradePairsInfo, depositWithdrawInfos] = await Promise.all([
      this.http
        .request({
          url: '/api/spot/v1/public/products',
        })
        .then(res => res.data.data.filter(v => v.status === 'online')),
      this.http
        .request({
          url: '/api/margin/v1/public/currencies',
        })
        .then(res => res.data.data.filter(v => v.status === '1' && v.isBorrowable)),
      this.http
        .request({
          url: '/api/spot/v1/public/currencies',
        })
        .then(res => res.data.data),
    ]);

    const data: GetTradePairInfoResponseDto[] = [];

    for (const tradePairInfo of tradePairsInfo) {
      const marginTradePair = marginTradePairsInfo.find(v => v.symbol === tradePairInfo.symbolName);
      const depositWithdrawInfo = depositWithdrawInfos.find(v => v.coinName === tradePairInfo.baseCoin)?.chains || [];
      const interestInfo =
        marginTradePair && marginTradePair.maxCrossLeverage !== '0'
          ? await this.http
              .request({
                url: '/api/margin/v1/cross/public/interestRateAndLimit',
                query: {
                  coin: tradePairInfo.baseCoin,
                },
              })
              .then(async res => {
                await sleep({ time: 101 });
                return res.data.data[0];
              })
          : marginTradePair && marginTradePair.maxIsolatedLeverage !== '0'
          ? await this.http
              .request({
                url: '/api/margin/v1/isolated/public/interestRateAndLimit',
                query: {
                  symbol: marginTradePair.symbol,
                },
              })
              .then(async res => {
                await sleep({ time: 101 });
                return res.data.data[0];
              })
          : undefined;

      data.push({
        symbol: tradePairInfo.symbol,
        baseAsset: tradePairInfo.baseCoin,
        quoteAsset: tradePairInfo.quoteCoin,
        baseAssetPrecision: parseInt(tradePairInfo.quantityScale),
        quoteAssetPrecision: parseInt(tradePairInfo.quotePrecision),
        pricePrecision: parseInt(tradePairInfo.priceScale),
        intervals: bitgetSpotIntervals,
        makerCommissionPercent: math(tradePairInfo.makerFeeRate).mul(100).toNumber(),
        takerCommissionPercent: math(tradePairInfo.takerFeeRate).mul(100).toNumber(),
        marketType: MarketTypeEnum.SPOT,
        provider: TradingProviderEnum.BITGET,
        spot: {
          deposits: depositWithdrawInfo
            .filter(v => v.rechargeable === 'true')
            .map(
              (v): DepositInfoDto => ({
                network: v.chain,
              }),
            ),
          withdraws: depositWithdrawInfo
            .filter(v => v.withdrawable === 'true')
            .map(
              (v): WithdrawInfoDto => ({
                network: v.chain,
                min: parseFloat(v.minWithdrawAmount),
                commissionSum: parseFloat(v.withdrawFee),
                precision: getPrecision(parseFloat(v.minWithdrawAmount)),
                extraCommissionPercent: math(v.extraWithDrawFee).mul(100).toNumber(),
              }),
            ),
          ...(marginTradePair && interestInfo
            ? {
                margin: {
                  borrowLimit: parseFloat(interestInfo.maxBorrowableAmount || interestInfo.baseMaxBorrowableAmount),
                  hourlyInterestPercent: math(interestInfo.yearlyInterestRate || interestInfo.baseYearlyInterestRate)
                    .mul(100)
                    .div(8760)
                    .toNumber(),
                },
              }
            : {}),
        },
      });
    }

    return {
      data,
    };
  }
}
