import * as crypto from 'crypto';
import * as qs from 'querystring';
import { Module } from '@nestjs/common';
import { httpClientKey, IHttpClient } from '@nmxjs/http';
import { externalProxyServiceKey, IExchangeProviderMethods, IExternalProxyService, ExchangeSecurityTypeEnum } from '../ExchangesProvider';
import { okxFuturesHttpProviderKey, okxFuturesProviderKey, okxFuturesApiUrl } from './constants';
import * as Services from './services';

@Module({
  providers: [
    ...Object.values(Services),
    {
      provide: okxFuturesHttpProviderKey,
      useFactory: (httpClient: IHttpClient, externalProxyService: IExternalProxyService) =>
        httpClient.createHttpClient({
          url: okxFuturesApiUrl,
          onRequest: async config => {
            const { publicKey, secretKey, securityType = ExchangeSecurityTypeEnum.FULL, proxy, ...headers } = config.headers;
            const query = {
              ...config.query,
            };

            if (publicKey && [ExchangeSecurityTypeEnum.KEY, ExchangeSecurityTypeEnum.FULL].includes(<ExchangeSecurityTypeEnum>securityType)) {
              headers['OK-ACCESS-KEY'] = publicKey;
            }

            if (secretKey && securityType === ExchangeSecurityTypeEnum.FULL) {
              const timestamp = new Date().toISOString();
              headers['OK-ACCESS-TIMESTAMP'] = timestamp;
              headers['OK-ACCESS-PASSPHRASE'] = 'Trade-Forecast1';
              headers['OK-ACCESS-SIGN'] = crypto
                .createHmac('sha256', <string>secretKey)
                .update(
                  decodeURIComponent(
                    `${timestamp}${config.method.toUpperCase()}${new URL(config.url).pathname}${
                      config.body
                        ? JSON.stringify(config.body)
                        : query
                        ? JSON.stringify(query).length !== 2
                          ? `?${qs.stringify(<any>query)}`
                          : ''
                        : ''
                    }`
                  )
                )
                .digest('base64');
            }

            return {
              query,
              headers,
              body: undefined,
              url: config.url,
              method: config.method,
              proxy: proxy ? await externalProxyService.getProxy() : undefined,
            };
          },
          onError: async ({ proxy }) => externalProxyService?.removeProxy(proxy),
        }),
      inject: [httpClientKey, externalProxyServiceKey],
    },
    {
      provide: okxFuturesProviderKey,
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
        updateTradingMultiplierService: Services.UpdateTradingMultiplierService
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
  exports: [okxFuturesProviderKey],
})
export class OkxFuturesProviderModule {}
