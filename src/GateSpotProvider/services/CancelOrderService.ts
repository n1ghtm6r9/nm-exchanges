import { Injectable, Inject } from '@nestjs/common';
import { CancelOrderRequestDto, CancelOrderResponseDto } from '../../ExchangesProvider';
import type { IGateSpotHttpProvider } from '../interfaces';
import { gateSpotHttpProviderKey } from '../constants';

@Injectable()
export class CancelOrderService {
  constructor(@Inject(gateSpotHttpProviderKey) protected readonly http: IGateSpotHttpProvider) {}

  public call = ({ orderId, tradePair, credentials }: CancelOrderRequestDto): Promise<CancelOrderResponseDto> => {
    return;
  };
}
