import { Injectable, Inject } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto, TradingMarginTypeEnum } from '../../ExchangesProvider';
import type { IMexcFuturesHttpProvider } from '../interfaces';
import { mexcFuturesHttpProviderKey } from '../constants';

@Injectable()
export class UpdateTradingMultiplierService {
  constructor(@Inject(mexcFuturesHttpProviderKey) protected readonly http: IMexcFuturesHttpProvider) {}

  public call = ({
    tradingMultiplier,
    marginType,
    tradePair,
    credentials,
  }: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> =>
    Promise.all(
      [1, 2].map(positionType =>
        this.http
          .request({
            method: 'POST',
            url: `/api/v1/private/position/change_leverage`,
            body: {
              openType: marginType === TradingMarginTypeEnum.ISOLATED ? 1 : 2,
              leverage: tradingMultiplier,
              symbol: `${tradePair.baseAsset}_${tradePair.quoteAsset}`,
              positionType,
            },
            headers: {
              ...credentials,
            },
          })
          .then(response => {
            if (!response.data.success) {
              throw new Error(response.data.message);
            }
          }),
      ),
    ).then(() => ({
      ok: true,
    }));
}
