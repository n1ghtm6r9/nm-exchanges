import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IOkxSpotHttpProvider } from '../interfaces';
import { okxSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(okxSpotHttpProviderKey) protected readonly http: IOkxSpotHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
