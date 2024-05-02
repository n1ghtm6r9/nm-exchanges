import { Injectable, Inject } from '@nestjs/common';
import { CreateOrdersRequestDto, CreateOrdersResponseDto } from '../../ExchangesProvider';
import type { IBitfinexFuturesHttpProvider } from '../interfaces';
import { bitfinexFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(bitfinexFuturesHttpProviderKey) protected readonly http: IBitfinexFuturesHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
