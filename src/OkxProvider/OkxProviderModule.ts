import { Module } from '@nestjs/common';
import { okxProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { OkxSpotProviderModule, okxSpotProviderKey } from '../OkxSpotProvider';
import { OkxFuturesProviderModule, okxFuturesProviderKey } from '../OkxFuturesProvider';

@Module({
  imports: [OkxSpotProviderModule, OkxFuturesProviderModule],
  providers: [
    {
      provide: okxProviderKey,
      useFactory: (okxSpotProvider: IExchangeProviderMethods, okxFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.OKX,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, okxSpotProvider],
            [MarketTypeEnum.FUTURES, okxFuturesProvider],
          ]).get(type),
      }),
      inject: [okxSpotProviderKey, okxFuturesProviderKey],
    },
  ],
  exports: [okxProviderKey],
})
export class OkxProviderModule {}
