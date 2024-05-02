import type { TradingProviderEnum, MarketTypeEnum } from '../../../interfaces';

export interface ILimitMakerErrorOptions {
  provider: TradingProviderEnum;
  marketType: MarketTypeEnum;
}
