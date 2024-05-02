import { Module } from '@nestjs/common';
import { bingxProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { BingxSpotProviderModule, bingxSpotProviderKey } from '../BingxSpotProvider';
import { BingxFuturesProviderModule, bingxFuturesProviderKey } from '../BingxFuturesProvider';

@Module({
  imports: [BingxSpotProviderModule, BingxFuturesProviderModule],
  providers: [
    {
      provide: bingxProviderKey,
      useFactory: (bingxSpotProvider: IExchangeProviderMethods, bingxFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.BINGX,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, bingxSpotProvider],
            [MarketTypeEnum.FUTURES, bingxFuturesProvider],
          ]).get(type),
      }),
      inject: [bingxSpotProviderKey, bingxFuturesProviderKey],
    },
  ],
  exports: [bingxProviderKey],
})
export class BingxProviderModule {}
