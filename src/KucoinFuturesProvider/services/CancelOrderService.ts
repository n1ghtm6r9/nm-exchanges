import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IKucoinFuturesHttpProvider } from '../interfaces';
import { kucoinFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(kucoinFuturesHttpProviderKey) protected readonly http: IKucoinFuturesHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> => {
    return;
  };
}
