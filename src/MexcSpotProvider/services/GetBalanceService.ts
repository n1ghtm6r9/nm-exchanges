import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IMexcSpotHttpProvider } from '../interfaces';
import { mexcSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(mexcSpotHttpProviderKey) protected readonly http: IMexcSpotHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
