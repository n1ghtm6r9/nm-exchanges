import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IBitgetSpotHttpProvider } from '../interfaces';
import { bitgetSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(bitgetSpotHttpProviderKey) protected readonly http: IBitgetSpotHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> => {
    return;
  };
}
