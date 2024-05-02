import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IHuobiFuturesHttpProvider } from '../interfaces';
import { huobiFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(huobiFuturesHttpProviderKey) protected readonly http: IHuobiFuturesHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
