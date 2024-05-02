import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IBingxFuturesHttpProvider } from '../interfaces';
import { bingxFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(bingxFuturesHttpProviderKey) protected readonly http: IBingxFuturesHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> => {
    return;
  };
}
