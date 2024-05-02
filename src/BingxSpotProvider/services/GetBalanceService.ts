import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IBingxSpotHttpProvider } from '../interfaces';
import { bingxSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(bingxSpotHttpProviderKey) protected readonly http: IBingxSpotHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
