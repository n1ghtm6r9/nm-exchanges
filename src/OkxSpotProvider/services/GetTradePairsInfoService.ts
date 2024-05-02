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
import type { IOkxSpotHttpProvider } from '../interfaces';
import { okxSpotHttpProviderKey, okxSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(okxSpotHttpProviderKey) protected readonly http: IOkxSpotHttpProvider) {}

  public call = ({ credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/api/v5/public/instruments',
          query: {
            instType: 'SPOT',
          },
        })
        .then(res => res.data.data.filter(v => v.state === 'live')),
      this.http
        .request({
          url: '/api/v5/public/instruments',
          query: {
            instType: 'MARGIN',
          },
        })
        .then(res => res.data.data.filter(v => v.state === 'live')),
      credentials
        ? this.http
            .request({
              url: '/api/v5/account/interest-limits',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.data[0].records)
        : [],
      credentials
        ? this.http
            .request({
              url: '/api/v5/asset/currencies',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.data)
        : [],
      credentials
        ? this.http
            .request({
              url: '/api/v5/account/trade-fee',
              query: {
                instType: 'SPOT',
              },
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data.data[0])
        : { maker: '0', taker: '0' },
    ]).then(([tradePairsInfo, marginTradePairsInfo, interestInfos, depositWithdrawInfos, tradeFeeInfo]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const interestInfo = interestInfos.find(v => v.ccy === tradePairInfo.baseCcy);
        return {
          symbol: tradePairInfo.instId,
          baseAsset: tradePairInfo.baseCcy,
          quoteAsset: tradePairInfo.quoteCcy,
          intervals: okxSpotIntervals,
          baseAssetPrecision: getPrecision(tradePairInfo.minSz),
          quoteAssetPrecision: getPrecision(tradePairInfo.tickSz),
          marketType: MarketTypeEnum.SPOT,
          pricePrecision: getPrecision(tradePairInfo.tickSz),
          provider: TradingProviderEnum.OKX,
          makerCommissionPercent: math(tradeFeeInfo.maker).mul(-100).toNumber(),
          takerCommissionPercent: math(tradeFeeInfo.taker).mul(-100).toNumber(),
          spot: {
            deposits: depositWithdrawInfos
              .filter(v => v.ccy === tradePairInfo.baseCcy && v.canDep)
              .map(
                (v): DepositInfoDto => ({
                  network: v.chain.split('-')[1],
                }),
              ),
            withdraws: depositWithdrawInfos
              .filter(v => v.ccy === tradePairInfo.baseCcy && v.canWd)
              .map(
                (v): WithdrawInfoDto => ({
                  min: parseFloat(v.minWd),
                  network: v.chain.split('-')[1],
                  precision: getPrecision(math(v.minDep).mul(100).toNumber()),
                  commissionSum: parseFloat(v.minFee),
                  extraCommissionPercent: 0,
                }),
              ),
            ...(marginTradePairsInfo.find(v => v.instId === tradePairInfo.instId) && interestInfo
              ? {
                  margin: {
                    borrowLimit: parseFloat(interestInfo.loanQuota),
                    hourlyInterestPercent: math(interestInfo.rate).mul(100).div(24).toNumber(),
                  },
                }
              : {}),
          },
        };
      }),
    }));
}
