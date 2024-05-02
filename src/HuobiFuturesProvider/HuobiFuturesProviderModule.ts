import * as cryptoJs from 'crypto-js';
import { Module } from '@nestjs/common';
import { httpClientKey, IHttpClient } from '@nmxjs/http';
import { externalProxyServiceKey, IExchangeProviderMethods, IExternalProxyService, ExchangeSecurityTypeEnum } from '../ExchangesProvider';
import { huobiFuturesHttpProviderKey, huobiFuturesProviderKey, huobiFuturesApiUrl } from './constants';
import * as Services from './services';

@Module({
  providers: [
    ...Object.values(Services),
    {
      provide: huobiFuturesHttpProviderKey,
      useFactory: (httpClient: IHttpClient, externalProxyService: IExternalProxyService) =>
        httpClient.createHttpClient({
          url: huobiFuturesApiUrl,
          onRequest: async config => {
            const { publicKey, secretKey, securityType = ExchangeSecurityTypeEnum.FULL, proxy, ...headers } = config.headers;
            const query = {
              ...config.query,
            };

            let url = config.url;

            if (publicKey && secretKey) {
              const timestamp = new Date().toISOString().slice(0, 19);
              const params = `AccessKeyId=${publicKey}&SignatureMethod=HmacSHA256&SignatureVersion=2&Timestamp=${encodeURIComponent(timestamp)}`;
              const payload = `${config.method.toUpperCase()}\n${new URL(config.url).host}\n${new URL(config.url).pathname}\n${params}`;
              const signatureBytes = cryptoJs.HmacSHA256(payload, <string>secretKey);
              const signature = cryptoJs.enc.Base64.stringify(signatureBytes);
              url = `${url}?${params}&Signature=${encodeURIComponent(signature)}`;
            }

            return {
              query,
              headers,
              body: undefined,
              url,
              method: config.method,
              proxy: proxy ? await externalProxyService.getProxy() : undefined,
            };
          },
          onError: async ({ proxy }) => externalProxyService?.removeProxy(proxy),
        }),
      inject: [httpClientKey, externalProxyServiceKey],
    },
    {
      provide: huobiFuturesProviderKey,
      useFactory: (
        getBalanceService: Services.GetBalanceService,
        cancelOrderService: Services.CancelOrderService,
        createOrderService: Services.CreateOrderService,
        createOrdersService: Services.CreateOrdersService,
        getOrderBookService: Services.GetOrderBookService,
        getOrderByIdService: Services.GetOrderByIdService,
        getMarketDataService: Services.GetMarketDataService,
        marketDataStreamService: Services.MarketDataStreamService,
        getTradePairInfoService: Services.GetTradePairInfoService,
        getTradePairsInfoService: Services.GetTradePairsInfoService,
        accountDataStreamService: Services.AccountDataStreamService,
        updateTradingMultiplierService: Services.UpdateTradingMultiplierService,
      ): IExchangeProviderMethods => ({
        getBalance: getBalanceService.call.bind(getBalanceService),
        cancelOrder: cancelOrderService.call.bind(cancelOrderService),
        createOrder: createOrderService.call.bind(createOrderService),
        createOrders: createOrdersService.call.bind(createOrdersService),
        getOrderBook: getOrderBookService.call.bind(getOrderBookService),
        getOrderById: getOrderByIdService.call.bind(getOrderByIdService),
        getMarketData: getMarketDataService.call.bind(getMarketDataService),
        marketDataStream: marketDataStreamService.call.bind(marketDataStreamService),
        getTradePairInfo: getTradePairInfoService.call.bind(getTradePairInfoService),
        getTradePairsInfo: getTradePairsInfoService.call.bind(getTradePairsInfoService),
        accountDataStream: accountDataStreamService.call.bind(accountDataStreamService),
        updateTradingMultiplier: updateTradingMultiplierService.call.bind(updateTradingMultiplierService),
        getFundingData: undefined,
      }),
      inject: [
        Services.GetBalanceService,
        Services.CancelOrderService,
        Services.CreateOrderService,
        Services.CreateOrdersService,
        Services.GetOrderBookService,
        Services.GetOrderByIdService,
        Services.GetMarketDataService,
        Services.MarketDataStreamService,
        Services.GetTradePairInfoService,
        Services.GetTradePairsInfoService,
        Services.AccountDataStreamService,
        Services.UpdateTradingMultiplierService,
      ],
    },
  ],
  exports: [huobiFuturesProviderKey],
})
export class HuobiFuturesProviderModule {}
