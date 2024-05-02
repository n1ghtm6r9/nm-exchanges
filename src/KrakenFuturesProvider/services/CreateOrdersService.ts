import { Injectable, Inject } from '@nestjs/common';
import { CreateOrdersRequestDto, CreateOrdersResponseDto } from '../../ExchangesProvider';
import type { IKrakenFuturesHttpProvider } from '../interfaces';
import { krakenFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(krakenFuturesHttpProviderKey) protected readonly http: IKrakenFuturesHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
