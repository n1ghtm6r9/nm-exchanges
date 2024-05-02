import { Module } from '@nestjs/common';
import { whitebitProviderKey } from './constants';
import { IExchangeProvider, IExchangeProviderMethods, MarketTypeEnum, TradingProviderEnum } from '../ExchangesProvider';
import { WhitebitSpotProviderModule, whitebitSpotProviderKey } from '../WhitebitSpotProvider';
import { WhitebitFuturesProviderModule, whitebitFuturesProviderKey } from '../WhitebitFuturesProvider';

@Module({
  imports: [WhitebitSpotProviderModule, WhitebitFuturesProviderModule],
  providers: [
    {
      provide: whitebitProviderKey,
      useFactory: (whitebitSpotProvider: IExchangeProviderMethods, whitebitFuturesProvider: IExchangeProviderMethods): IExchangeProvider => ({
        provider: TradingProviderEnum.WHITEBIT,
        type: type =>
          new Map<MarketTypeEnum, IExchangeProviderMethods>([
            [MarketTypeEnum.SPOT, whitebitSpotProvider],
            [MarketTypeEnum.FUTURES, whitebitFuturesProvider],
          ]).get(type),
      }),
      inject: [whitebitSpotProviderKey, whitebitFuturesProviderKey],
    },
  ],
  exports: [whitebitProviderKey],
})
export class WhitebitProviderModule {}
