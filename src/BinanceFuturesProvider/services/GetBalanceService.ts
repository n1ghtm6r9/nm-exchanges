import { Injectable, Inject } from '@nestjs/common';
import { GetBalanceRequestDto, GetBalanceResponseDto } from '../../ExchangesProvider';
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetBalanceService {
  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public call = ({ asset, credentials }: GetBalanceRequestDto): Promise<GetBalanceResponseDto> =>
    this.http
      .request({
        url: '/fapi/v2/balance',
        headers: {
          ...credentials,
        },
      })
      .then(response => response.data)
      .then(balances => balances.find(f => f.asset.toLowerCase() === asset.toLowerCase()))
      .then(balanceInfo => ({ amount: balanceInfo ? parseFloat(balanceInfo.maxWithdrawAmount) : 0 }));
}
