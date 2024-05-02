import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IBingxFuturesHttpProvider } from '../interfaces';
import { bingxFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(bingxFuturesHttpProviderKey) protected readonly http: IBingxFuturesHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
