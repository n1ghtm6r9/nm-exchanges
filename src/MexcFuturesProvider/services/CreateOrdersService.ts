import { Injectable, Inject, Logger } from '@nestjs/common';
import { CreateOrdersRequestDto, CreateOrdersResponseDto } from '../../ExchangesProvider';
import type { IMexcFuturesHttpProvider } from '../interfaces';
import { mexcFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(mexcFuturesHttpProviderKey) protected readonly http: IMexcFuturesHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
