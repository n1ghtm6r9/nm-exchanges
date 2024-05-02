import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IBinanceSpotHttpProvider } from '../interfaces';
import { binanceSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(binanceSpotHttpProviderKey) protected readonly http: IBinanceSpotHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> =>
    this.http
      .request({
        url: '/api/v3/account',
        headers: {
          ...credentials,
        },
      })
      .then(response => response.data.balances)
      .then(balances => balances.find(f => f.asset.toLowerCase() === asset.toLowerCase()))
      .then(balanceInfo => ({ amount: balanceInfo ? parseFloat(balanceInfo.free) : 0 }));
}
