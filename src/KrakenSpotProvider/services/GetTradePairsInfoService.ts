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
import type { IKrakenSpotHttpProvider } from '../interfaces';
import { krakenSpotHttpProviderKey, krakenSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  constructor(@Inject(krakenSpotHttpProviderKey) protected readonly http: IKrakenSpotHttpProvider) {}

  public call = ({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/0/public/AssetPairs',
        })
        .then(res => Object.values<any>(res.data.result).filter(v => v.status === 'online')),
    ]).then(([tradePairsInfo]) => ({
      data: tradePairsInfo.map(tradePairInfo => {
        const [baseAsset, quoteAsset] = tradePairInfo.wsname.split('/');
        return {
          symbol: tradePairInfo.altname,
          baseAsset,
          quoteAsset,
          baseAssetPrecision: tradePairInfo.cost_decimals - 1,
          quoteAssetPrecision: getPrecision(parseFloat(tradePairInfo.tick_size)),
          pricePrecision: getPrecision(parseFloat(tradePairInfo.tick_size)),
          makerCommissionPercent: tradePairInfo.fees_maker[0][1],
          takerCommissionPercent: tradePairInfo.fees[0][1],
          intervals: krakenSpotIntervals,
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.KRAKEN,
          spot: {
            deposits: [],
            withdraws: [],
          },
        };
      }),
    }));
}
