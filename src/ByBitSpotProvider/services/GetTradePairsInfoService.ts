import math from 'big.js';
import { getPrecision } from '@nmxjs/utils';
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
import type { IBybitSpotHttpProvider } from '../interfaces';
import { bybitSpotHttpProviderKey, bybitSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(bybitSpotHttpProviderKey) protected readonly http: IBybitSpotHttpProvider) {}

  public call = ({ credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/v5/market/instruments-info',
          query: {
            category: 'spot',
          },
        })
        .then(res => res.data.result.list.filter(v => v.status === 'Trading')),
      credentials
        ? this.http
            .request({
              url: '/v5/account/collateral-info',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.result.list)
        : [],
      credentials
        ? this.http
            .request({
              url: '/v5/account/fee-rate',
              query: {
                category: 'spot',
              },
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.result.list)
        : [],
      credentials
        ? this.http
            .request({
              url: '/v5/asset/coin/query-info',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.result.rows)
        : [],
    ]).then(([tradePairsInfo, marginsInfo, commissionsInfo, depositWithdrawInfos]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const marginInfo = marginsInfo.find(v => v.currency === tradePairInfo.baseCoin);
        const commissionInfo = commissionsInfo.find(v => v.symbol === tradePairInfo.symbol);
        const depositWithdrawInfo = depositWithdrawInfos.find(v => v.coin === tradePairInfo.baseCoin)?.chains || [];
        return {
          symbol: tradePairInfo.symbol,
          baseAsset: tradePairInfo.baseCoin,
          quoteAsset: tradePairInfo.quoteCoin,
          intervals: bybitSpotIntervals,
          baseAssetPrecision: getPrecision(parseFloat(tradePairInfo.lotSizeFilter.basePrecision)),
          quoteAssetPrecision: getPrecision(parseFloat(tradePairInfo.lotSizeFilter.quotePrecision)),
          pricePrecision: getPrecision(parseFloat(tradePairInfo.priceFilter.tickSize)),
          makerCommissionPercent: commissionInfo ? math(commissionInfo.makerFeeRate).mul(100).toNumber() : 0,
          takerCommissionPercent: commissionInfo ? math(commissionInfo.takerFeeRate).mul(100).toNumber() : 0,
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.BYBIT,
          spot: {
            deposits: depositWithdrawInfo
              .filter(v => v.chainDeposit === '1')
              .map(
                (v): DepositInfoDto => ({
                  network: v.chainType,
                }),
              ),
            withdraws: depositWithdrawInfo
              .filter(v => v.chainWithdraw === '1')
              .map(
                (v): WithdrawInfoDto => ({
                  network: v.chainType,
                  min: parseFloat(v.withdrawMin),
                  precision: parseInt(v.minAccuracy),
                  commissionSum: parseFloat(v.withdrawFee),
                  extraCommissionPercent: 0,
                }),
              ),
            ...(tradePairInfo.marginTrading !== 'none' && marginInfo
              ? {
                  margin: {
                    borrowLimit: parseFloat(marginInfo.maxBorrowingAmount),
                    hourlyInterestPercent: math(marginInfo.hourlyBorrowRate).mul(100).toNumber(),
                  },
                }
              : {}),
          },
        };
      }),
    }));
}
