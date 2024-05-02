import { Module } from '@nestjs/common';
import { bybitProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { BybitSpotProviderModule, bybitSpotProviderKey } from '../ByBitSpotProvider';
import { BybitFuturesProviderModule, bybitFuturesProviderKey } from '../BybitFuturesProvider';

@Module({
  imports: [BybitSpotProviderModule, BybitFuturesProviderModule],
  providers: [
    {
      provide: bybitProviderKey,
      useFactory: (bybitSpotProvider: IExchangeProviderMethods, bybitFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.BYBIT,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, bybitSpotProvider],
            [MarketTypeEnum.FUTURES, bybitFuturesProvider],
          ]).get(type),
      }),
      inject: [bybitSpotProviderKey, bybitFuturesProviderKey],
    },
  ],
  exports: [bybitProviderKey],
})
export class BybitProviderModule {}
