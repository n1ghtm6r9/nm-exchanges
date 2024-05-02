import math from 'big.js';
import moment from 'moment';
import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IMexcFuturesHttpProvider } from '../interfaces';
import { mexcFuturesHttpProviderKey } from '../constants';
import { convertInterval } from '../utils';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(mexcFuturesHttpProviderKey) protected readonly http: IMexcFuturesHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> =>
    this.http
      .request({
        url: `/api/v1/contract/kline/${options.tradePair.baseAsset}_${options.tradePair.quoteAsset}`,
        query: {
          interval: convertInterval(options.tradePair.interval),
          ...(typeof options.startTime === 'number' ? { start: moment(options.startTime).unix() } : {}),
          ...(typeof options.endTime === 'number' ? { end: moment(options.endTime).unix() } : {}),
          ...(options.limit ? { limit: options.limit } : {}),
        },
      })
      .then(response => response.data)
      .then(res => ({
        marketData: res.data.time.map((time, i) => ({
          time: math(time).mul(1000).toNumber(),
          open: res.data.open[i],
          high: res.data.high[i],
          low: res.data.low[i],
          close: res.data.close[i],
          volumeBaseAsset: res.data.vol[i],
          volumeQuoteAsset: res.data.amount[i],
          tradeCount: 0,
        })),
      }));
}
