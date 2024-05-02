import { parseJson } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto } from '../../ExchangesProvider';
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesHttpProviderKey } from '../constants';

@Injectable()
export class UpdateTradingMultiplierService {
  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public call = ({
    tradingMultiplier,
    marginType,
    tradePair,
    credentials,
  }: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> =>
    Promise.all([
      this.http.request({
        method: 'POST',
        url: '/fapi/v1/leverage',
        query: {
          symbol: `${tradePair.baseAsset}${tradePair.quoteAsset}`,
          leverage: tradingMultiplier,
        },
        headers: {
          ...credentials,
        },
      }),
      this.http
        .request({
          method: 'POST',
          url: '/fapi/v1/marginType',
          query: {
            symbol: `${tradePair.baseAsset}${tradePair.quoteAsset}`,
            marginType,
          },
          headers: {
            ...credentials,
          },
        })
        .then(() => ({ ok: true }))
        .catch(error => {
          const errorData = parseJson({ data: error.message });

          if (errorData && !Array.isArray(errorData) && errorData?.msg === 'No need to change margin type.') {
            return;
          }

          throw error;
        }),
    ]).then(() => ({ ok: true }));
}
