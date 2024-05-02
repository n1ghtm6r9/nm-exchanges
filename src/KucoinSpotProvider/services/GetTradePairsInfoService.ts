import math from 'big.js';
import { getPrecision, getBatchesFromArray, sleep } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  MarketTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IKucoinSpotHttpProvider } from '../interfaces';
import { kucoinSpotHttpProviderKey, kucoinSpotIntervals } from '../constants';

// TODO
@Injectable()
export class GetTradePairsInfoService {
  protected readonly networkMap = {
    ETH: 'ERC20',
    BSC: 'BEP20',
    BNB: 'BEP2',
    TRX: 'TRC20',
  };

  constructor(@Inject(kucoinSpotHttpProviderKey) protected readonly http: IKucoinSpotHttpProvider) {}

  public async call({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> {
    const [tradePairsInfo, marginLimits, interestInfos] = await Promise.all([
      this.http
        .request({
          url: '/api/v2/symbols',
          headers: {
            proxy,
          },
        })
        .then(res => res.data.data),
      credentials
        ? this.http
            .request({
              url: '/api/v1/risk/limit/strategy',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.data)
        : [],
      credentials
        ? this.http
            .request({
              url: '/api/v3/project/list',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.data)
        : [],
    ]);

    let result: GetTradePairInfoResponseDto[] = tradePairsInfo
      .filter(v => v.enableTrading)
      .map((tradePairInfo): GetTradePairInfoResponseDto => {
        const marginLimit = marginLimits.find(v => v.currency === tradePairInfo.baseCurrency);
        const interestInfo = interestInfos.find(v => v.currency === tradePairInfo.baseCurrency);
        return {
          symbol: tradePairInfo.symbol,
          provider: TradingProviderEnum.KUCOIN,
          marketType: MarketTypeEnum.SPOT,
          baseAsset: tradePairInfo.baseCurrency,
          quoteAsset: tradePairInfo.quoteCurrency,
          intervals: kucoinSpotIntervals,
          pricePrecision: getPrecision(parseFloat(tradePairInfo.priceIncrement)),
          baseAssetPrecision: getPrecision(parseFloat(tradePairInfo.baseMinSize)),
          quoteAssetPrecision: getPrecision(parseFloat(tradePairInfo.quoteMinSize)),
          // makerCommissionPercent: 0,
          // takerCommissionPercent: 0,
          makerCommissionPercent: 0.1,
          takerCommissionPercent: 0.1,
          spot: {
            deposits: [],
            withdraws: [],
            ...(tradePairInfo.isMarginEnabled && marginLimit && interestInfo
              ? {
                  margin: {
                    borrowLimit: parseFloat(marginLimit.borrowMaxAmount),
                    hourlyInterestPercent: math(interestInfo.marketInterestRate).mul(100).div(365).div(24).toNumber(),
                  },
                }
              : {}),
          },
        };
      });

    // if (!credentials) {
    //   return {
    //     data: result,
    //   };
    // }

    // const batchResult = getBatchesFromArray({
    //   arr: result,
    //   size: 10,
    // });

    // result = [];

    // for (const batch of batchResult) {
    //   let hasCache = true;

    //   const commissions = await this.http
    //     .request({
    //       url: '/api/v1/trade-fees',
    //       query: {
    //         symbols: batch.map(d => d.symbol).join(','),
    //       },
    //       headers: credentials,
    //       cacheTttMs: 2592000000, // 30 days
    //     })
    //     .then(res => {
    //       if (!res.cached) {
    //         hasCache = false;
    //       }
    //       return res.data.data.map(d => ({
    //         symbol: d.symbol,
    //         makerCommissionPercent: math(parseFloat(d.makerFeeRate)).mul(100).toNumber(),
    //         takerCommissionPercent: math(parseFloat(d.takerFeeRate)).mul(100).toNumber(),
    //       }));
    //     });

    //   const depositWithdrawInfos = await Promise.all(
    //     batch.map(async v => {
    //       const res = await this.http
    //         .request({
    //           url: `/api/v2/currencies/${v.baseAsset}`,
    //           headers: credentials,
    //           cacheTttMs: 3600000, // 1 hour
    //         })
    //         .then(res => {
    //           if (!res.cached) {
    //             hasCache = false;
    //           }
    //           return res.data.data;
    //         });

    //       if (!res) {
    //         return;
    //       }

    //       return res;
    //     })
    //   ).then(res => res.filter(Boolean));
    //   result.push(
    //     ...batch.map((d): GetTradePairInfoResponseDto => {
    //       const commission = commissions.find(v => v.symbol === d.symbol);
    //       const depositWithdrawInfo = depositWithdrawInfos.find(v => v.currency === d.baseAsset)?.chains || [];
    //       return {
    //         ...d,
    //         makerCommissionPercent: commission?.makerCommissionPercent || 0,
    //         takerCommissionPercent: commission?.takerCommissionPercent || 0,
    //         spot: {
    //           ...d.spot,
    //           deposits: depositWithdrawInfo
    //             .filter(v => v.isDepositEnabled)
    //             .map(v => ({
    //               network: this.networkMap[v.chain.toUpperCase()] || v.chain.toUpperCase(),
    //             })),
    //           withdraws: depositWithdrawInfo
    //             .filter(v => v.isWithdrawEnabled)
    //             .map(v => ({
    //               network: this.networkMap[v.chain.toUpperCase()] || v.chain.toUpperCase(),
    //               min: parseFloat(v.withdrawalMinSize),
    //               commissionSum: parseFloat(v.withdrawalMinFee),
    //               precision: getPrecision(parseFloat(v.withdrawalMinSize)),
    //               extraCommissionPercent: 0
    //             })),
    //         },
    //       };
    //     })
    //   );

    //   if (!hasCache) {
    //     await sleep({ time: 300 });
    //   }
    // }

    return {
      data: result,
    };
  }
}
