import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IOkxFuturesHttpProvider } from '../interfaces';
import { okxFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(okxFuturesHttpProviderKey) protected readonly http: IOkxFuturesHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
