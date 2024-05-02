import * as qs from 'qs';
import fetch from 'node-fetch';
import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IGateFuturesHttpProvider } from '../interfaces';
import { gateFuturesApiUrl, gateFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(gateFuturesHttpProviderKey) protected readonly http: IGateFuturesHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> => {
    return;
  };
}
