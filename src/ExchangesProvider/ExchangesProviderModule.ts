import { Module, Global, DynamicModule, FactoryProvider } from '@nestjs/common';
import { WebSocketModule } from '@nmxjs/ws';
import { HttpClientModule } from '@nmxjs/http';
import { exchangesProviderModuleOptionsKey, exchangesProvidersKey, externalProxyServiceKey } from './constants';
import { BinanceProviderModule, binanceProviderKey } from '../BinanceProvider';
import { MexcProviderModule, mexcProviderKey } from '../MexcProvider';
import { KucoinProviderModule, kucoinProviderKey } from '../KucoinProvider';
import { BybitProviderModule, bybitProviderKey } from '../BybitProvider';
import { BitgetProviderModule, bitgetProviderKey } from '../BitgetProvider';
import { OkxProviderModule, okxProviderKey } from '../OkxProvider';
import { GateProviderModule, gateProviderKey } from '../GateProvider';
import { HuobiProviderModule, huobiProviderKey } from '../HuobiProvider';
import { WhitebitProviderModule, whitebitProviderKey } from '../WhitebitProvider';
import { BingxProviderModule, bingxProviderKey } from '../BingxProvider';
import { BitfinexProviderModule, bitfinexProviderKey } from '../BitfinexProvider';
import { KrakenProviderModule, krakenProviderKey } from '../KrakenProvider';
import type {
  IExchangeProvider,
  IExchangesProvider,
  IExchangesProviderModuleOptions,
  IExchangesProviderModuleAsyncOptions,
  IExternalProxyService,
} from './interfaces';

const exchangeProviders = [
  {
    key: binanceProviderKey,
    module: BinanceProviderModule,
  },
  {
    key: mexcProviderKey,
    module: MexcProviderModule,
  },
  {
    key: kucoinProviderKey,
    module: KucoinProviderModule,
  },
  {
    key: bybitProviderKey,
    module: BybitProviderModule,
  },
  {
    key: bitgetProviderKey,
    module: BitgetProviderModule,
  },
  {
    key: okxProviderKey,
    module: OkxProviderModule,
  },
  {
    key: gateProviderKey,
    module: GateProviderModule,
  },
  {
    key: huobiProviderKey,
    module: HuobiProviderModule,
  },
  {
    key: whitebitProviderKey,
    module: WhitebitProviderModule,
  },
  {
    key: bingxProviderKey,
    module: BingxProviderModule,
  },
  {
    key: bitfinexProviderKey,
    module: BitfinexProviderModule,
  },
  {
    key: krakenProviderKey,
    module: KrakenProviderModule,
  },
];

@Global()
@Module({})
export class ExchangesProviderModule {
  public static register(options?: IExchangesProviderModuleOptions): DynamicModule {
    return {
      module: ExchangesProviderModule,
      imports: [HttpClientModule, WebSocketModule, ...exchangeProviders.map(e => e.module)],
      providers: [
        {
          provide: exchangesProviderModuleOptionsKey,
          useValue: options || null,
        },
        {
          provide: externalProxyServiceKey,
          useFactory: (injectOptions: IExchangesProviderModuleOptions): IExternalProxyService => injectOptions?.proxyService || null,
          inject: [exchangesProviderModuleOptionsKey],
        },
        {
          provide: exchangesProvidersKey,
          useFactory: (...providers: IExchangeProvider[]): IExchangesProvider => ({
            get: provider => providers.find(p => p.provider === provider),
            list: () => providers,
          }),
          inject: exchangeProviders.map(e => e.key),
        },
      ],
      exports: [exchangesProvidersKey, externalProxyServiceKey],
    };
  }

  public static registerAsync({ inject, useFactory }: IExchangesProviderModuleAsyncOptions): DynamicModule {
    const { providers, ...otherData } = this.register(null);
    return {
      ...otherData,
      providers: providers.map((provider: FactoryProvider) =>
        provider.provide === exchangesProviderModuleOptionsKey
          ? {
              provide: exchangesProviderModuleOptionsKey,
              useFactory,
              inject,
            }
          : provider
      ),
    };
  }
}
