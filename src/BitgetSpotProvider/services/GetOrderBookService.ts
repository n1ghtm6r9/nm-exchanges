import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { bitgetSpotHttpProviderKey } from '../constants';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IBitgetSpotHttpProvider } from '../interfaces';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(bitgetSpotHttpProviderKey) protected readonly http: IBitgetSpotHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
