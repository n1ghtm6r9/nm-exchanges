import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IBingxSpotHttpProvider } from '../interfaces';
import { bingxSpotHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(bingxSpotHttpProviderKey) protected readonly http: IBingxSpotHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> => {
    return;
  };
}
