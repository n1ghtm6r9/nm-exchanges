import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetOrderByIdRequestDto,
  GetOrderByIdResponseDto,
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
export class GetOrderByIdService {
  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public async call({ orderId, tradePair, credentials }: GetOrderByIdRequestDto): Promise<GetOrderByIdResponseDto> {
    const symbol = `${tradePair.baseAsset}${tradePair.quoteAsset}`;

    const order = await this.http
      .request({
        url: '/fapi/v1/order',
        query: {
          symbol,
          origClientOrderId: orderId,
        },
        headers: {
          ...credentials,
        },
      })
      .then(response => response.data);

    if (!order || orderId !== order.clientOrderId) {
      return {
        order: null,
      };
    }

    const status = ['NEW', 'PARTIALLY_FILLED'].includes(order.status)
      ? TradingOrderStatusEnum.IN_PROGRESS
      : 'FILLED' === order.status
      ? TradingOrderStatusEnum.COMPLETED
      : TradingOrderStatusEnum.CANCELED;

    const trades =
      status !== TradingOrderStatusEnum.COMPLETED
        ? []
        : await this.http
            .request({
              url: '/fapi/v1/userTrades',
              query: {
                symbol,
                orderId: order.orderId.toString(),
                limit: 1000,
              },
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data);

    const orderType = ['MARKET', 'STOP_MARKET', 'TAKE_PROFIT_MARKET'].includes(order.type) ? TradingOrderTypeEnum.MARKET : TradingOrderTypeEnum.LIMIT;
    const price = parseFloat(order.avgPrice) || parseFloat(order.price);
    const commissionAsset = trades.find(v => v.commissionAsset)?.commissionAsset;
    const commissionAmount = trades.reduce((res, item) => res.add(parseFloat(item.commission) || 0), math(0)).toNumber();
    const baseAssetAmount = parseFloat(order.origQty);
    const quoteAssetAmount = parseFloat(order.cumQuote) || math(baseAssetAmount).mul(price).toNumber();

    return {
      order: {
        id: orderId,
        orderId: order.orderId.toString(),
        marketType: MarketTypeEnum.FUTURES,
        provider: TradingProviderEnum.BINANCE,
        status,
        orderType,
        positionSide:
          order.positionSide === 'LONG' || (order.positionSide === 'BOTH' && order.side === 'BUY') ? PositionEnum.LONG : PositionEnum.SHORT,
        additionalOrderType: ['STOP', 'STOP_MARKET'].includes(order.type)
          ? AdditionalTradingOrderTypeEnum.STOP_LOSS
          : ['TAKE_PROFIT', 'TAKE_PROFIT_MARKET'].includes(order.type)
          ? AdditionalTradingOrderTypeEnum.TAKE_PROFIT
          : null,
        side: order.side === 'BUY' ? TradingOrderSideEnum.BUY : TradingOrderSideEnum.SELL,
        price,
        baseAssetAmount: tradePair.baseAsset === commissionAsset ? math(baseAssetAmount).minus(commissionAmount).toNumber() : baseAssetAmount,
        quoteAssetAmount: tradePair.quoteAsset === commissionAsset ? math(quoteAssetAmount).minus(commissionAmount).toNumber() : quoteAssetAmount,
        updatedAt: order.updateTime,
        createdAt: order.time,
        ...(commissionAsset ? { commissionAmount, commissionAsset } : {}),
      },
    };
  }
}
