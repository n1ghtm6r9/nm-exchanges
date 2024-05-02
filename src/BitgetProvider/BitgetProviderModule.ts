import { Module } from '@nestjs/common';
import { MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { bitgetProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods } from '../ExchangesProvider';
import { BitgetSpotProviderModule, bitgetSpotProviderKey } from '../BitgetSpotProvider';
import { BitgetFuturesProviderModule, bitgetFuturesProviderKey } from '../BitgetFuturesProvider';

@Module({
  imports: [BitgetSpotProviderModule, BitgetFuturesProviderModule],
  providers: [
    {
      provide: bitgetProviderKey,
      useFactory: (bitgetSpotProvider: IExchangeProviderMethods, bitgetFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.BITGET,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, bitgetSpotProvider],
            [MarketTypeEnum.FUTURES, bitgetFuturesProvider],
          ]).get(type),
      }),
      inject: [bitgetSpotProviderKey, bitgetFuturesProviderKey],
    },
  ],
  exports: [bitgetProviderKey],
})
export class BitgetProviderModule {}
