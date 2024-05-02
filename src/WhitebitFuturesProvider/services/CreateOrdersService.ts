import { Injectable, Inject } from '@nestjs/common';
import { CreateOrdersRequestDto, CreateOrdersResponseDto } from '../../ExchangesProvider';
import type { IWhitebitFuturesHttpProvider } from '../interfaces';
import { whitebitFuturesHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(whitebitFuturesHttpProviderKey) protected readonly http: IWhitebitFuturesHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
