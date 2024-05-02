import * as qs from 'qs';
import fetch from 'node-fetch';
import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IBitfinexFuturesHttpProvider } from '../interfaces';
import { bitfinexFuturesApiUrl, bitfinexFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(bitfinexFuturesHttpProviderKey) protected readonly http: IBitfinexFuturesHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> => {
    return;
  };
}
