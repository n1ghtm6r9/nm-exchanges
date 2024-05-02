import type { TradingProviderEnum } from '../interfaces';
import { IExchangeProvider } from './IExchangeProvider';

export interface IExchangesProvider {
  get(provider: TradingProviderEnum): IExchangeProvider;
  list(): IExchangeProvider[];
}
