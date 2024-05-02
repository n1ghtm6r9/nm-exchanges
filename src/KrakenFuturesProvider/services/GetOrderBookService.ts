import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IKrakenFuturesHttpProvider } from '../interfaces';
import { krakenFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(krakenFuturesHttpProviderKey) protected readonly http: IKrakenFuturesHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
