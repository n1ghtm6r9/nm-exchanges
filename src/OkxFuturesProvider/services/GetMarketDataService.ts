import * as qs from 'qs';
import fetch from 'node-fetch';
import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IOkxFuturesHttpProvider } from '../interfaces';
import { okxFuturesApiUrl, okxFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(okxFuturesHttpProviderKey) protected readonly http: IOkxFuturesHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> => {
    return;
  };
}
