import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IBinanceSpotHttpProvider } from '../interfaces';
import { binanceSpotHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(binanceSpotHttpProviderKey) protected readonly http: IBinanceSpotHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> =>
    this.http
      .request({
        method: 'DELETE',
        url: '/api/v3/order',
        query: {
          origClientOrderId: orderId,
          symbol: `${tradePair.baseAsset}${tradePair.quoteAsset}`,
        },
        headers: {
          ...credentials,
        },
      })
      .then(() => ({
        ok: true,
      }))
      .catch(() => ({
        ok: false,
      }));
}
