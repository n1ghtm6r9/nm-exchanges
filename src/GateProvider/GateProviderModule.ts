import { Module } from '@nestjs/common';
import { gateProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { GateSpotProviderModule, gateSpotProviderKey } from '../GateSpotProvider';
import { GateFuturesProviderModule, gateFuturesProviderKey } from '../GateFuturesProvider';

@Module({
  imports: [GateSpotProviderModule, GateFuturesProviderModule],
  providers: [
    {
      provide: gateProviderKey,
      useFactory: (gateSpotProvider: IExchangeProviderMethods, gateFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.GATE,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, gateSpotProvider],
            [MarketTypeEnum.FUTURES, gateFuturesProvider],
          ]).get(type),
      }),
      inject: [gateSpotProviderKey, gateFuturesProviderKey],
    },
  ],
  exports: [gateProviderKey],
})
export class GateProviderModule {}
