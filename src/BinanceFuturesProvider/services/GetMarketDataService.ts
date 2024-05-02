import * as qs from 'qs';
import fetch from 'node-fetch';
import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesApiUrl, binanceFuturesHttpProviderKey } from '../constants';

// TODO move to http package (request provider enum)
@Injectable()
export class GetMarketDataService {
  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> =>
    fetch(
      `${binanceFuturesApiUrl}/fapi/v1/klines?${qs.stringify({
        symbol: `${options.tradePair.baseAsset}${options.tradePair.quoteAsset}`,
        interval: `${options.tradePair.interval.value}${options.tradePair.interval.type}`,
        ...(typeof options.startTime === 'number' ? { startTime: options.startTime } : {}),
        ...(typeof options.endTime === 'number' ? { endTime: options.endTime } : {}),
        ...(options.limit ? { limit: options.limit } : {}),
      })}`
    )
      .then(async res => {
        const data = await res.json();

        if (res.statusText !== 'OK') {
          throw new Error(data.msg);
        }

        return data;
      })
      .then(data => ({
        marketData: data.map(candle => ({
          time: candle[0],
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volumeBaseAsset: parseFloat(candle[5]),
          volumeQuoteAsset: parseFloat(candle[7]),
          tradeCount: candle[8],
        })),
      }));
}
