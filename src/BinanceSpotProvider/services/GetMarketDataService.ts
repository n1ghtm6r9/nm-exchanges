import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IBinanceSpotHttpProvider } from '../interfaces';
import { binanceSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(binanceSpotHttpProviderKey) protected readonly http: IBinanceSpotHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> =>
    this.http
      .request({
        url: '/api/v3/klines',
        query: {
          symbol: `${options.tradePair.baseAsset}${options.tradePair.quoteAsset}`,
          interval: `${options.tradePair.interval.value}${options.tradePair.interval.type}`,
          ...(typeof options.startTime === 'number' ? { startTime: options.startTime } : {}),
          ...(typeof options.endTime === 'number' ? { endTime: options.endTime } : {}),
          ...(options.limit ? { limit: options.limit } : {}),
        },
      })
      .then(res => ({
        marketData: res.data.map(candle => ({
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
