import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { okxSpotHttpProviderKey } from '../constants';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IOkxSpotHttpProvider } from '../interfaces';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(okxSpotHttpProviderKey) protected readonly http: IOkxSpotHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
