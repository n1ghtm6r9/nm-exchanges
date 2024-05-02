import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IBybitFuturesHttpProvider } from '../interfaces';
import { bybitFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(bybitFuturesHttpProviderKey) protected readonly http: IBybitFuturesHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> => {
    return;
  };
}
