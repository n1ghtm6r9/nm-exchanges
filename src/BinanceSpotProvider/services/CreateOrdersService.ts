import { Injectable, Inject } from '@nestjs/common';
import { calcAvgPrice, numberToString, parseJson } from '@nmxjs/utils';
import {
  CreateOrdersRequestDto,
  CreateOrdersResponseDto,
  LimitMakerError,
  AdditionalTradingOrderTypeEnum,
  MarketTypeEnum,
  TradingOrderSideEnum,
  TradingOrderTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBinanceSpotHttpProvider } from '../interfaces';
import { binanceSpotHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(binanceSpotHttpProviderKey) protected readonly http: IBinanceSpotHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> =>
    Promise.all(
      orders.map(order => {
        const type =
          order.additionalOrderType === AdditionalTradingOrderTypeEnum.LIMIT_MAKER && order.orderType === TradingOrderTypeEnum.LIMIT
            ? 'LIMIT_MAKER'
            : order.additionalOrderType === AdditionalTradingOrderTypeEnum.STOP_LOSS && order.orderType === TradingOrderTypeEnum.MARKET
            ? 'STOP_LOSS'
            : order.additionalOrderType === AdditionalTradingOrderTypeEnum.STOP_LOSS && order.orderType === TradingOrderTypeEnum.LIMIT
            ? 'STOP_LOSS_LIMIT'
            : order.additionalOrderType === AdditionalTradingOrderTypeEnum.TAKE_PROFIT && order.orderType === TradingOrderTypeEnum.MARKET
            ? 'TAKE_PROFIT'
            : order.additionalOrderType === AdditionalTradingOrderTypeEnum.TAKE_PROFIT && order.orderType === TradingOrderTypeEnum.LIMIT
            ? 'TAKE_PROFIT_LIMIT'
            : order.orderType === TradingOrderTypeEnum.LIMIT
            ? 'LIMIT'
            : 'MARKET';
        const price = numberToString(order.price);
        return this.http
          .request({
            method: 'POST',
            url: '/api/v3/order',
            query: {
              symbol: `${order.tradePair.baseAsset}${order.tradePair.quoteAsset}`,
              side: order.side === TradingOrderSideEnum.BUY ? 'BUY' : 'SELL',
              type,
              newClientOrderId: order.orderId,
              newOrderRespType: 'FULL',
              ...(['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT'].includes(type) ? { timeInForce: 'GTC' } : {}),
              ...(order.price && ['LIMIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT', 'LIMIT_MAKER'].includes(type) ? { price } : {}),
              ...(order.price && ['STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT'].includes(type) ? { stopPrice: price } : {}),
              ...(type === 'MARKET' && order.side === TradingOrderSideEnum.BUY
                ? { quoteOrderQty: numberToString(order.quoteAssetAmount) }
                : { quantity: numberToString(order.baseAssetAmount) }),
            },
            headers: {
              ...credentials,
            },
          })
          .then(res => ({
            exchangeOrderId: res.data.orderId.toString(),
            price: res.data.fills?.length
              ? calcAvgPrice(
                  res.data.fills.map(v => ({
                    price: parseFloat(v.price),
                    amount: parseFloat(v.qty),
                  })),
                )
              : parseFloat(res.data.price),
          }));
      }),
    )
      .then(result => ({
        result,
      }))
      .catch(e => {
        const errorData = parseJson({ data: e.message });

        if (errorData && !Array.isArray(errorData) && errorData?.msg === 'Order would immediately match and take.') {
          throw new LimitMakerError({
            provider: TradingProviderEnum.BINANCE,
            marketType: MarketTypeEnum.SPOT,
          });
        }

        throw e;
      });
}
