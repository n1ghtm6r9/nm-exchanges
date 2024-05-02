import { Module } from '@nestjs/common';
import { bitfinexProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { BitfinexSpotProviderModule, bitfinexSpotProviderKey } from '../BitfinexSpotProvider';
import { BitfinexFuturesProviderModule, bitfinexFuturesProviderKey } from '../BitfinexFuturesProvider';

@Module({
  imports: [BitfinexSpotProviderModule, BitfinexFuturesProviderModule],
  providers: [
    {
      provide: bitfinexProviderKey,
      useFactory: (bitfinexSpotProvider: IExchangeProviderMethods, bitfinexFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.BITFINEX,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, bitfinexSpotProvider],
            [MarketTypeEnum.FUTURES, bitfinexFuturesProvider],
          ]).get(type),
      }),
      inject: [bitfinexSpotProviderKey, bitfinexFuturesProviderKey],
    },
  ],
  exports: [bitfinexProviderKey],
})
export class BitfinexProviderModule {}
