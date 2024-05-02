import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import { gateSpotHttpProviderKey } from '../constants';
import { GetOrderBookRequestDto, GetOrderBookResponseDto } from '../../ExchangesProvider';
import type { IGateSpotHttpProvider } from '../interfaces';

@Injectable()
export class GetOrderBookService {
  constructor(@Inject(gateSpotHttpProviderKey) protected readonly http: IGateSpotHttpProvider) {}

  public call = ({ limit, tradePair, proxy }: GetOrderBookRequestDto): Promise<GetOrderBookResponseDto> => {
    return;
  };
}
