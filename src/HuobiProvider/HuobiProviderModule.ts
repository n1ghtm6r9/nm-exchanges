import { Module } from '@nestjs/common';
import { huobiProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { HuobiSpotProviderModule, huobiSpotProviderKey } from '../HuobiSpotProvider';
import { HuobiFuturesProviderModule, huobiFuturesProviderKey } from '../HuobiFuturesProvider';

@Module({
  imports: [HuobiSpotProviderModule, HuobiFuturesProviderModule],
  providers: [
    {
      provide: huobiProviderKey,
      useFactory: (huobiSpotProvider: IExchangeProviderMethods, huobiFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.HUOBI,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, huobiSpotProvider],
            [MarketTypeEnum.FUTURES, huobiFuturesProvider],
          ]).get(type),
      }),
      inject: [huobiSpotProviderKey, huobiFuturesProviderKey],
    },
  ],
  exports: [huobiProviderKey],
})
export class HuobiProviderModule {}
