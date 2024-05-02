import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IOkxFuturesHttpProvider } from '../interfaces';
import { okxFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(okxFuturesHttpProviderKey) protected readonly http: IOkxFuturesHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> => {
    return;
  };
}
