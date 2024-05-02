import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IKrakenSpotHttpProvider } from '../interfaces';
import { krakenSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(krakenSpotHttpProviderKey) protected readonly http: IKrakenSpotHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
