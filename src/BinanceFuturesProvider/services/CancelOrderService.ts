import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> =>
    this.http
      .request({
        method: 'DELETE',
        url: '/fapi/v1/order',
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
      }));
}
