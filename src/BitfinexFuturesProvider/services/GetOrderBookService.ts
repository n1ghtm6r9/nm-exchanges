import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IBitfinexFuturesHttpProvider } from '../interfaces';
import { bitfinexFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(bitfinexFuturesHttpProviderKey) protected readonly http: IBitfinexFuturesHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
