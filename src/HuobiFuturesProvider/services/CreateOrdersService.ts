import { Injectable, Inject } from '@nestjs/common';
import { CreateOrdersRequestDto, CreateOrdersResponseDto } from '../../ExchangesProvider';
import type { IHuobiFuturesHttpProvider } from '../interfaces';
import { huobiFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(huobiFuturesHttpProviderKey) protected readonly http: IHuobiFuturesHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
