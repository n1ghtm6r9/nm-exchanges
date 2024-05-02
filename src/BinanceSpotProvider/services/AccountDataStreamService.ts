import math from 'big.js';
import { Inject, Injectable } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import {
  AccountDataStreamRequestDto,
  AccountDataStreamDto,
  BaseStreamService,
  ExchangeSecurityTypeEnum,
  AdditionalTradingOrderTypeEnum,
  MarketTypeEnum,
  TradingOrderSideEnum,
  TradingOrderStatusEnum,
  TradingOrderTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBinanceSpotHttpProvider } from '../interfaces';
import { binanceSpotHttpProviderKey } from '../constants';

@Injectable()
export class AccountDataStreamService extends BaseStreamService<AccountDataStreamRequestDto, AccountDataStreamDto> {
  constructor(
    @Inject(binanceSpotHttpProviderKey) protected readonly http: IBinanceSpotHttpProvider,
    @Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory,
  ) {
    super(webSocketFactory);
  }

  protected getKey = (options: AccountDataStreamRequestDto) => `${options.credentials.publicKey}${options.credentials.secretKey}`;

  protected getWsOptions = (options: AccountDataStreamRequestDto) => [
    {
      getUrl: () =>
        this.http
          .request({
            url: '/api/v3/userDataStream',
            method: 'POST',
            headers: {
              ...options.credentials,
              securityType: ExchangeSecurityTypeEnum.KEY,
            },
          })
          .then(res => `wss://stream.binance.com:9443/ws/${res.data.listenKey}`),
      reconnectAfterMs: 82800000,
      callGetUrlIntervalMs: 3000000,
    },
  ];

  protected onData(data) {
    const result: AccountDataStreamDto[] = [];

    if (data.e === 'outboundAccountPosition') {
      data.B.forEach(v => {
        result.push({
          type: 'balance',
          data: {
            amount: parseFloat(v.f),
            asset: v.a,
            marketType: MarketTypeEnum.SPOT,
          },
        });
      });
    } else if (data.e === 'balanceUpdate') {
      result.push({
        type: 'balance',
        data: {
          amount: parseFloat(data.d),
          asset: data.a,
          marketType: MarketTypeEnum.SPOT,
        },
      });
    } else if (data.e === 'executionReport' && (data.L > 0 || data.p > 0)) {
      const price = parseFloat(data.L) || parseFloat(data.p);
      const commissionAsset = data.N;
      const commissionAmount = data.n ? parseFloat(data.n) : 0;
      const assetIndex = data.s.indexOf(commissionAsset);
      const baseAsset =
        assetIndex !== -1 ? (assetIndex === 0 ? data.s.substring(0, commissionAsset.length) : data.s.substring(0, assetIndex)) : undefined;
      const quoteAsset = assetIndex !== -1 ? (assetIndex === 0 ? data.s.substring(commissionAsset.length) : data.s.substring(assetIndex)) : undefined;
      const baseAssetAmount = parseFloat(data.z) || parseFloat(data.q);
      const quoteAssetAmount = parseFloat(data.Z) || math(baseAssetAmount).mul(price).toNumber();

      result.push({
        type: 'order',
        data: {
          id: data.C || data.c,
          orderId: data.i.toString(),
          marketType: MarketTypeEnum.SPOT,
          provider: TradingProviderEnum.BINANCE,
          side: data.S === 'BUY' ? TradingOrderSideEnum.BUY : TradingOrderSideEnum.SELL,
          price,
          baseAssetAmount: baseAsset === commissionAsset ? math(baseAssetAmount).minus(commissionAmount).toNumber() : baseAssetAmount,
          quoteAssetAmount: quoteAsset === commissionAsset ? math(quoteAssetAmount).minus(commissionAmount).toNumber() : quoteAssetAmount,
          status: ['NEW', 'PARTIALLY_FILLED'].includes(data.X)
            ? TradingOrderStatusEnum.IN_PROGRESS
            : 'FILLED' === data.X
            ? TradingOrderStatusEnum.COMPLETED
            : TradingOrderStatusEnum.CANCELED,
          orderType: ['MARKET', 'STOP_LOSS', 'TAKE_PROFIT'].includes(data.o) ? TradingOrderTypeEnum.MARKET : TradingOrderTypeEnum.LIMIT,
          additionalOrderType:
            data.o === 'LIMIT_MAKER'
              ? AdditionalTradingOrderTypeEnum.LIMIT_MAKER
              : ['STOP_LOSS', 'STOP_LOSS_LIMIT'].includes(data.o)
              ? AdditionalTradingOrderTypeEnum.STOP_LOSS
              : ['TAKE_PROFIT', 'TAKE_PROFIT_LIMIT'].includes(data.o)
              ? AdditionalTradingOrderTypeEnum.TAKE_PROFIT
              : null,
          updatedAt: data.T,
          createdAt: data.O,
          ...(commissionAsset ? { commissionAsset, commissionAmount } : {}),
        },
      });
    }

    return result;
  }
}
