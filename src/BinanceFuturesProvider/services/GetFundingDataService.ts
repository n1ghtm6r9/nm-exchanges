import * as qs from 'qs';
import math from 'big.js';
import fetch from 'node-fetch';
import { Injectable, Inject } from '@nestjs/common';
import { GetFundingDataRequestDto, GetFundingDataResponseDto } from '../../ExchangesProvider';
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesApiUrl, binanceFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetFundingDataService {
  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public call = (options: GetFundingDataRequestDto): Promise<GetFundingDataResponseDto> =>
    fetch(
      `${binanceFuturesApiUrl}/fapi/v1/fundingRate?${qs.stringify({
        symbol: `${options.tradePair.baseAsset}${options.tradePair.quoteAsset}`,
        ...(typeof options.startTime === 'number' ? { startTime: options.startTime } : {}),
        ...(typeof options.endTime === 'number' ? { endTime: options.endTime } : {}),
        ...(options.limit ? { limit: options.limit } : {}),
      })}`,
    )
      .then(async res => {
        const data = await res.json();

        if (res.status !== 200) {
          throw new Error(data.msg);
        }

        return data;
      })
      .then(data => ({
        fundingData: data.map(v => ({
          time: v.fundingTime,
          fundingRate: math(v.fundingRate).mul(100).toNumber(),
        })),
      }));
}
