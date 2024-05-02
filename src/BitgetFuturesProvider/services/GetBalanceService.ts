import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IBitgetFuturesHttpProvider } from '../interfaces';
import { bitgetFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(bitgetFuturesHttpProviderKey) protected readonly http: IBitgetFuturesHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
