import * as qs from 'qs';
import fetch from 'node-fetch';
import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IBitgetFuturesHttpProvider } from '../interfaces';
import { bitgetFuturesApiUrl, bitgetFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(bitgetFuturesHttpProviderKey) protected readonly http: IBitgetFuturesHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> => {
    return;
  };
}
