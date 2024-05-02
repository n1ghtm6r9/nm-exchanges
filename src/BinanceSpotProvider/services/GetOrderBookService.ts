import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { binanceSpotHttpProviderKey } from '../constants';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IBinanceSpotHttpProvider } from '../interfaces';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(binanceSpotHttpProviderKey) protected readonly http: IBinanceSpotHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> =>
    this.http
      .request({
        url: '/api/v3/depth',
        query: {
          symbol: `${tradePair.baseAsset}${tradePair.quoteAsset}`,
          limit,
        },
        headers: {
          proxy,
        },
      })
      .then(res => {
        const mapAsksBids = ([rawPrice, rawQty]) => {
          const price = parseFloat(rawPrice);
          const volumeBaseAsset = parseFloat(rawQty);
          return {
            price,
            volumeBaseAsset: parseFloat(rawQty),
            volumeQuoteAsset: math(price).mul(volumeBaseAsset).toNumber(),
          };
        };
        return {
          asks: res.data.asks.map(mapAsksBids),
          bids: res.data.bids.map(mapAsksBids),
        };
      });
}
