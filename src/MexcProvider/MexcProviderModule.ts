import { Module } from '@nestjs/common';
import { mexcProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { MexcFuturesProviderModule, mexcFuturesProviderKey } from '../MexcFuturesProvider';
import { MexcSpotProviderModule, mexcSpotProviderKey } from '../MexcSpotProvider';

@Module({
  imports: [MexcFuturesProviderModule, MexcSpotProviderModule],
  providers: [
    {
      provide: mexcProviderKey,
      useFactory: (mexcFuturesProvider: IExchangeProviderMethods, mexcSpotProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.MEXC,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, mexcSpotProvider],
            [MarketTypeEnum.FUTURES, mexcFuturesProvider],
          ]).get(type),
      }),
      inject: [mexcFuturesProviderKey, mexcSpotProviderKey],
    },
  ],
  exports: [mexcProviderKey],
})
export class MexcProviderModule {}
