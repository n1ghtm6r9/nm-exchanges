import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IWhiteSpotHttpProvider } from '../interfaces';
import { whitebitSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(whitebitSpotHttpProviderKey) protected readonly http: IWhiteSpotHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> => {
    return;
  };
}
