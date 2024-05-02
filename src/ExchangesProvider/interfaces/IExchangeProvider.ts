import type { MarketTypeEnum, TradingProviderEnum } from '../interfaces';
import { IExchangeProviderMethods } from './IExchangeProviderMethods';

export interface IExchangeProvider {
  readonly provider: TradingProviderEnum;
  type(marketType: MarketTypeEnum): IExchangeProviderMethods;
}
