import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IMexcFuturesHttpProvider } from '../interfaces';
import { mexcFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(mexcFuturesHttpProviderKey) protected readonly http: IMexcFuturesHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> =>
    this.http
      .request({
        url: `/api/v1/private/account/asset/${asset}`,
        headers: {
          ...credentials,
        },
      })
      .then(response => response.data)
      .then(data => ({ amount: data.data.availableBalance }));
}
