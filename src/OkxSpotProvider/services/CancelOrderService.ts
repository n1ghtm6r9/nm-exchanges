import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IOkxSpotHttpProvider } from '../interfaces';
import { okxSpotHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(okxSpotHttpProviderKey) protected readonly http: IOkxSpotHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> => {
    return;
  };
}
