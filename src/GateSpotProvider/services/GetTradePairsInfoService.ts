import math from 'big.js';
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
import type { IGateSpotHttpProvider } from '../interfaces';
import { gateSpotHttpProviderKey, gateSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(gateSpotHttpProviderKey) protected readonly http: IGateSpotHttpProvider) {}

  public call = ({ proxy }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/api/v4/spot/currency_pairs',
        })
        .then(res => res.data.filter(v => v.trade_status === 'tradable')),
      this.http
        .request({
          url: '/api/v4/margin/uni/currency_pairs',
        })
        .then(res => res.data),
      this.http
        .request({
          url: '/api/v4/margin/cross/currencies',
        })
        .then(res => res.data.filter(v => v.status === 1)),
      this.http
        .request({
          url: '/api/v4/spot/currencies',
        })
        .then(res => res.data),
    ]).then(([tradePairsInfo, marginTradePairsInfo, interestInfos, depositWithdrawInfos]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const interestInfo = interestInfos.find(v => v.name === tradePairInfo.base);
        const marginTradePairInfo = marginTradePairsInfo.find(v => v.currency_pair === tradePairInfo.id);
        const depositWithdrawInfo = depositWithdrawInfos.filter(
          v => v.currency === tradePairInfo.base || v.currency === `${tradePairInfo.base}_${v.chain}`,
        );
        return {
          symbol: tradePairInfo.id,
          baseAsset: tradePairInfo.base,
          quoteAsset: tradePairInfo.quote,
          intervals: gateSpotIntervals,
          baseAssetPrecision: tradePairInfo.amount_precision,
          quoteAssetPrecision: tradePairInfo.precision,
          pricePrecision: tradePairInfo.precision,
          makerCommissionPercent: parseFloat(tradePairInfo.fee),
          takerCommissionPercent: parseFloat(tradePairInfo.fee),
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.GATE,
          spot: {
            deposits: depositWithdrawInfo
              .filter(v => !v.deposit_disabled)
              .map(
                (v): DepositInfoDto => ({
                  network: v.chain,
                }),
              ),
            withdraws: depositWithdrawInfo
              .filter(v => !v.withdraw_disabled && !v.withdraw_delayed)
              .map(
                (v): WithdrawInfoDto => ({
                  min: 0,
                  precision: 0,
                  commissionSum: 0,
                  network: v.chain,
                  extraCommissionPercent: v.fixed_rate ? math(v.fixed_rate).mul(100).toNumber() : 0,
                }),
              ),
            ...(marginTradePairInfo && interestInfo
              ? {
                  margin: {
                    borrowLimit: parseFloat(interestInfo.user_max_borrow_amount),
                    hourlyInterestPercent: math(interestInfo.rate).mul(118).toNumber(),
                  },
                }
              : {}),
          },
        };
      }),
    }));
}
