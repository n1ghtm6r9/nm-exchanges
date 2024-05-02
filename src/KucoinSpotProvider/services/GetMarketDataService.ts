import { Injectable, Inject } from '@nestjs/common';
import { GetMarketDataRequestDto, GetMarketDataResponseDto } from '../../ExchangesProvider';
import type { IKucoinSpotHttpProvider } from '../interfaces';
import { kucoinSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetMarketDataService {
  constructor(@Inject(kucoinSpotHttpProviderKey) protected readonly http: IKucoinSpotHttpProvider) {}

  public call = (options: GetMarketDataRequestDto): Promise<GetMarketDataResponseDto> => {
    return;
  };
}
