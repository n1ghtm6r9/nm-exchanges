import { IExchangesProviderModuleOptions } from './IExchangesProviderModuleOptions';

export interface IExchangesProviderModuleAsyncOptions {
  inject?: any[];
  useFactory: (...args) => Promise<IExchangesProviderModuleOptions> | IExchangesProviderModuleOptions;
}
