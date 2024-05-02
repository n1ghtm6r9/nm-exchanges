import { Module } from '@nestjs/common';
import { binanceProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { BinanceSpotProviderModule, binanceSpotProviderKey } from '../BinanceSpotProvider';
import { BinanceFuturesProviderModule, binanceFuturesProviderKey } from '../BinanceFuturesProvider';

@Module({
  imports: [BinanceSpotProviderModule, BinanceFuturesProviderModule],
  providers: [
    {
      provide: binanceProviderKey,
      useFactory: (binanceSpotProvider: IExchangeProviderMethods, binanceFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.BINANCE,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, binanceSpotProvider],
            [MarketTypeEnum.FUTURES, binanceFuturesProvider],
          ]).get(type),
      }),
      inject: [binanceSpotProviderKey, binanceFuturesProviderKey],
    },
  ],
  exports: [binanceProviderKey],
})
export class BinanceProviderModule {}
