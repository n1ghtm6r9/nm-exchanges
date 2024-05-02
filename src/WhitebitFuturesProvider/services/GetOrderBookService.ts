import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IWhitebitFuturesHttpProvider } from '../interfaces';
import { whitebitFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(whitebitFuturesHttpProviderKey) protected readonly http: IWhitebitFuturesHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
