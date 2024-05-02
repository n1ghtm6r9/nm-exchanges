import * as qs from 'qs';
import fetch from 'node-fetch';
import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IKucoinFuturesHttpProvider } from '../interfaces';
import { kucoinFuturesApiUrl, kucoinFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(kucoinFuturesHttpProviderKey) protected readonly http: IKucoinFuturesHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> => {
    return;
  };
}
