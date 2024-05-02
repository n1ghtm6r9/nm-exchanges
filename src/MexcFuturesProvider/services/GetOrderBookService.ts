import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IMexcFuturesHttpProvider } from '../interfaces';
import { mexcFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(mexcFuturesHttpProviderKey) protected readonly http: IMexcFuturesHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> =>
    this.http
      .request({
        url: `/api/v1/contract/depth/${tradePair.baseAsset}_${tradePair.quoteAsset}`,
        query: {
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
          asks: res.data.data.asks.map(mapAsksBids),
          bids: res.data.data.bids.map(mapAsksBids),
        };
      });
}
