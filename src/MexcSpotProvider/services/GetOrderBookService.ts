import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { mexcSpotHttpProviderKey } from '../constants';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IMexcSpotHttpProvider } from '../interfaces';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(mexcSpotHttpProviderKey) protected readonly http: IMexcSpotHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
