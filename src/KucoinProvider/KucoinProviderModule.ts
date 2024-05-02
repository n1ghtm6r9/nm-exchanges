import { Module } from '@nestjs/common';
import { kucoinProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { KucoinSpotProviderModule, kucoinSpotProviderKey } from '../KucoinSpotProvider';
import { KucoinFuturesProviderModule, kucoinFuturesProviderKey } from '../KucoinFuturesProvider';

@Module({
  imports: [KucoinSpotProviderModule, KucoinFuturesProviderModule],
  providers: [
    {
      provide: kucoinProviderKey,
      useFactory: (kucoinSpotProvider: IExchangeProviderMethods, kucoinFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.KUCOIN,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, kucoinSpotProvider],
            [MarketTypeEnum.FUTURES, kucoinFuturesProvider],
          ]).get(type),
      }),
      inject: [kucoinSpotProviderKey, kucoinFuturesProviderKey],
    },
  ],
  exports: [kucoinProviderKey],
})
export class KucoinProviderModule {}
