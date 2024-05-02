import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IKucoinFuturesHttpProvider } from '../interfaces';
import { kucoinFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(kucoinFuturesHttpProviderKey) protected readonly http: IKucoinFuturesHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
