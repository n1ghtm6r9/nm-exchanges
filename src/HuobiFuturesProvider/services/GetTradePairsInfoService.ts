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
import type { IHuobiFuturesHttpProvider } from '../interfaces';
import { huobiFuturesIntervals, huobiFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(huobiFuturesHttpProviderKey) protected readonly http: IHuobiFuturesHttpProvider) {}

  public call = ({ credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/linear-swap-api/v1/swap_contract_info',
        })
        .then(res => res.data.data.filter(v => v.contract_status === 1)),
      this.http
        .request({
          url: '/linear-swap-api/v1/swap_batch_funding_rate',
        })
        .then(res => res.data.data),
      credentials
        ? this.http
            .request({
              url: '/linear-swap-api/v1/swap_fee',
              method: 'POST',
              headers: {
                'content-type': 'application/json;charset=UTF-8',
                ...credentials,
              },
            })
            .then(res => res.data.data)
        : [],
    ]).then(([tradePairsInfo, fundingInfos, feesInfo]) => ({
      data: tradePairsInfo.map((tradePairInfo): GetTradePairInfoResponseDto => {
        const feeInfo = feesInfo.find(v => v.contract_code === tradePairInfo.contract_code);
        const fundingInfo = fundingInfos.find(v => v.contract_code === tradePairInfo.contract_code);
        return {
          symbol: tradePairInfo.contract_code,
          baseAsset: tradePairInfo.symbol,
          quoteAsset: tradePairInfo.trade_partition,
          baseAssetPrecision: getPrecision(tradePairInfo.contract_size),
          quoteAssetPrecision: getPrecision(tradePairInfo.price_tick),
          pricePrecision: getPrecision(tradePairInfo.price_tick),
          intervals: huobiFuturesIntervals,
          makerCommissionPercent: math(feeInfo.open_maker_fee).mul(100).toNumber(),
          takerCommissionPercent: math(feeInfo.open_taker_fee).mul(100).toNumber(),
          marketType: MarketTypeEnum.FUTURES,
          provider: TradingProviderEnum.HUOBI,
          futures: {
            nextFundingTime: parseInt(fundingInfo.funding_time),
            fundingRate: math(fundingInfo.funding_rate).mul(100).toNumber(),
            fundingIntervalHours: math(fundingInfo.next_funding_time).minus(fundingInfo.funding_time).div(3600000).toNumber(),
          },
        };
      }),
    }));
}
