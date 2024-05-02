import * as crypto from 'crypto';
import { Module } from '@nestjs/common';
import { objToQs } from '@nmxjs/utils';
import { httpClientKey, IHttpClient } from '@nmxjs/http';
import { externalProxyServiceKey, IExchangeProviderMethods, IExternalProxyService, ExchangeSecurityTypeEnum } from '../ExchangesProvider';
import { mexcFuturesHttpProviderKey, mexcFuturesProviderKey, mexcFuturesApiUrl } from './constants';
import * as Services from './services';

@Module({
  providers: [
    ...Object.values(Services),
    {
      provide: mexcFuturesHttpProviderKey,
      useFactory: (httpClient: IHttpClient, externalProxyService: IExternalProxyService) =>
        httpClient.createHttpClient({
          url: mexcFuturesApiUrl,
          onRequest: async config => {
            const { publicKey, secretKey, securityType = ExchangeSecurityTypeEnum.FULL, proxy, ...headers } = config.headers;
            const query = {
              ...config.query,
            };

            if (publicKey && [ExchangeSecurityTypeEnum.KEY, ExchangeSecurityTypeEnum.FULL].includes(<ExchangeSecurityTypeEnum>securityType)) {
              headers['ApiKey'] = publicKey;
            }

            if (secretKey && securityType === ExchangeSecurityTypeEnum.FULL) {
              const timestamp = Date.now();
              headers['Request-Time'] = timestamp;
              headers['Signature'] = crypto
                .createHmac('sha256', <string>secretKey)
                .update(
                  `${publicKey}${timestamp}${
                    config.body
                      ? JSON.stringify(config.body)
                      : objToQs({
                          obj: query,
                        })
                  }`
                )
                .digest('hex');
            }

            return {
              query,
              headers,
              body: config.body,
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
      provide: mexcFuturesProviderKey,
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
  exports: [mexcFuturesProviderKey],
})
export class MexcFuturesProviderModule {}
