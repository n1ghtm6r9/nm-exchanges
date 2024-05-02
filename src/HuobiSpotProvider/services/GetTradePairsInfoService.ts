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
import type { IHuobiSpotHttpProvider } from '../interfaces';
import { huobiSpotHttpProviderKey, huobiSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(huobiSpotHttpProviderKey) protected readonly http: IHuobiSpotHttpProvider) {}

  public call = ({ credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/v2/settings/common/symbols',
        })
        .then(res => res.data.data.filter(v => v.state === 'online' && v.te)),
      this.http
        .request({
          url: '/v2/reference/currencies',
        })
        .then(res => res.data.data.filter(v => v.instStatus === 'normal')),
      credentials
        ? this.http
            .request({
              url: '/v1/margin/loan-info',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.data)
        : [],
    ]).then(([tradePairsInfo, depositWithdrawInfos, interestInfos]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const depositWithdrawInfo = depositWithdrawInfos.find(v => v.currency === tradePairInfo.bc)?.chains || [];
        const interestInfo = interestInfos.find(v => v.symbol === tradePairInfo.sc)?.currencies?.[0];

        return {
          symbol: tradePairInfo.sc,
          baseAsset: tradePairInfo.bc.toUpperCase(),
          quoteAsset: tradePairInfo.qc.toUpperCase(),
          baseAssetPrecision: tradePairInfo.tap,
          quoteAssetPrecision: tradePairInfo.ttp,
          pricePrecision: tradePairInfo.tpp,
          intervals: huobiSpotIntervals,
          // TODO /v2/reference/transact-fee-rate
          makerCommissionPercent: 0.2,
          takerCommissionPercent: 0.2,
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.HUOBI,
          spot: {
            deposits: depositWithdrawInfo
              .filter(v => v.depositStatus === 'allowed')
              .map(
                (v): DepositInfoDto => ({
                  network: v.baseChainProtocol,
                }),
              ),
            withdraws: depositWithdrawInfo
              .filter(v => v.withdrawStatus === 'allowed')
              .map(
                (v): WithdrawInfoDto => ({
                  min: parseFloat(v.minWithdrawAmt),
                  precision: v.withdrawPrecision,
                  commissionSum: v.transactFeeWithdraw ? parseFloat(v.transactFeeWithdraw) : 0,
                  network: v.baseChainProtocol,
                  extraCommissionPercent:
                    v.transactFeeRateWithdraw || v.minTransactFeeWithdraw
                      ? math(v.transactFeeRateWithdraw || v.minTransactFeeWithdraw)
                          .mul(100)
                          .toNumber()
                      : 0,
                }),
              ),
            ...(interestInfo
              ? {
                  margin: {
                    borrowLimit: parseFloat(interestInfo['max-loan-amt']),
                    hourlyInterestPercent: math(interestInfo['interest-rate']).mul(100).div(24).toNumber(),
                  },
                }
              : {}),
          },
        };
      }),
    }));
}
