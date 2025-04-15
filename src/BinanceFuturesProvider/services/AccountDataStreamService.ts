import math from 'big.js';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { sleep } from '@nmxjs/utils';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import {
  AccountDataStreamRequestDto,
  AccountDataStreamDto,
  BaseStreamService,
  ExchangeSecurityTypeEnum,
  AdditionalTradingOrderTypeEnum,
  MarketTypeEnum,
  PositionEnum,
  TradingOrderSideEnum,
  TradingOrderStatusEnum,
  TradingOrderTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesHttpProviderKey } from '../constants';

@Injectable()
export class AccountDataStreamService extends BaseStreamService<AccountDataStreamRequestDto, AccountDataStreamDto> {
  constructor(
    @Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider,
    @Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory,
  ) {
    super(webSocketFactory);
  }

  protected getKey = (options: AccountDataStreamRequestDto) => `${options.credentials.publicKey}${options.credentials.secretKey}`;

  protected getWsOptions = (options: AccountDataStreamRequestDto) => [
    {
      getUrl: async () => {
        while (true) {
          const url = await this.http
            .request({
              url: '/fapi/v1/listenKey',
              method: 'POST',
              headers: {
                ...options.credentials,
                securityType: ExchangeSecurityTypeEnum.KEY,
              },
            })
            .then(res => `wss://fstream.binance.com/ws/${res.data.listenKey}`)
            .catch(async () => {
              await sleep(1000);
              return null;
            });

          if (url) {
            return url;
          } else {
            Logger.warn('Binance Futures ws get url error, try again!');
          }
        }
      },
      reconnectAfterMs: 3300000,
    },
  ];

  protected onData(data) {
    const result: AccountDataStreamDto[] = [];

    if (data.e === 'ACCOUNT_UPDATE') {
      data.a.B.forEach(v => {
        result.push({
          type: 'balance',
          data: {
            amount: parseFloat(v.wb),
            asset: v.a,
            marketType: MarketTypeEnum.FUTURES,
          },
        });
      });
    } else if (data.e === 'ORDER_TRADE_UPDATE' && (data.o.ap > 0 || data.o.p > 0 || data.o.sp > 0)) {
      const price = parseFloat(data.o.ap) || parseFloat(data.o.p) || parseFloat(data.o.sp);
      const commissionAsset = data.o.N;
      const commissionAmount = data.o.n ? parseFloat(data.o.n) : 0;
      const assetIndex = data.o.s.indexOf(commissionAsset);
      const baseAsset =
        assetIndex !== -1 ? (assetIndex === 0 ? data.o.s.substring(0, commissionAsset.length) : data.o.s.substring(0, assetIndex)) : undefined;
      const quoteAsset =
        assetIndex !== -1 ? (assetIndex === 0 ? data.o.s.substring(commissionAsset.length) : data.o.s.substring(assetIndex)) : undefined;
      const baseAssetAmount = parseFloat(data.o.z) || parseFloat(data.o.q);
      const quoteAssetAmount = math(baseAssetAmount).mul(price).toNumber();

      result.push({
        type: 'order',
        data: {
          id: data.o.c,
          orderId: data.o.i.toString(),
          price,
          provider: TradingProviderEnum.BINANCE,
          marketType: MarketTypeEnum.FUTURES,
          side: data.o.S === 'BUY' ? TradingOrderSideEnum.BUY : TradingOrderSideEnum.SELL,
          positionSide: data.o.ps === 'LONG' || (data.o.ps === 'BOTH' && data.o.S === 'BUY') ? PositionEnum.LONG : PositionEnum.SHORT,
          baseAssetAmount: baseAsset === commissionAsset ? math(baseAssetAmount).minus(commissionAmount).toNumber() : baseAssetAmount,
          quoteAssetAmount: quoteAsset === commissionAsset ? math(quoteAssetAmount).minus(commissionAmount).toNumber() : quoteAssetAmount,
          orderType: ['MARKET', 'STOP_MARKET', 'TAKE_PROFIT_MARKET'].includes(data.o.ot) ? TradingOrderTypeEnum.MARKET : TradingOrderTypeEnum.LIMIT,
          additionalOrderType: ['STOP', 'STOP_MARKET'].includes(data.o.ot)
            ? AdditionalTradingOrderTypeEnum.STOP_LOSS
            : ['TAKE_PROFIT', 'TAKE_PROFIT_MARKET'].includes(data.o.ot)
            ? AdditionalTradingOrderTypeEnum.TAKE_PROFIT
            : null,
          status: ['NEW', 'PARTIALLY_FILLED'].includes(data.o.X)
            ? TradingOrderStatusEnum.IN_PROGRESS
            : 'FILLED' === data.o.X
            ? TradingOrderStatusEnum.COMPLETED
            : TradingOrderStatusEnum.CANCELED,
          updatedAt: data.T,
          createdAt: data.T,
          ...(commissionAsset ? { commissionAsset, commissionAmount } : {}),
        },
      });
    }

    return result;
  }
}
