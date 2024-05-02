import { Module } from '@nestjs/common';
import { krakenProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { KrakenSpotProviderModule, krakenSpotProviderKey } from '../KrakenSpotProvider';
import { KrakenFuturesProviderModule, krakenFuturesProviderKey } from '../KrakenFuturesProvider';

@Module({
  imports: [KrakenSpotProviderModule, KrakenFuturesProviderModule],
  providers: [
    {
      provide: krakenProviderKey,
      useFactory: (krakenSpotProvider: IExchangeProviderMethods, krakenFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.KRAKEN,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, krakenSpotProvider],
            [MarketTypeEnum.FUTURES, krakenFuturesProvider],
          ]).get(type),
      }),
      inject: [krakenSpotProviderKey, krakenFuturesProviderKey],
    },
  ],
  exports: [krakenProviderKey],
})
export class KrakenProviderModule {}
