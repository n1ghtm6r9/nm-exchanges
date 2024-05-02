import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  CreateOrdersRequestDto,
  CreateOrdersResponseDto,
  AdditionalTradingOrderTypeEnum,
  TradingOrderSideEnum,
  TradingOrderTypeEnum,
} from '../../ExchangesProvider';
import type { IBinanceFuturesHttpProvider } from '../interfaces';
import { binanceFuturesHttpProviderKey } from '../constants';
import { calcAvgPrice, numberToString, parseJson } from '@nmxjs/utils';

const allowErrorMessages = {
  immediatelyTrigger: 'Order would immediately trigger.',
  internalError: 'Internal error; unable to process your request. Please try again.',
};

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(binanceFuturesHttpProviderKey) protected readonly http: IBinanceFuturesHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> =>
    Promise.all(
      orders.map(async order => {
        let type =
          order.additionalOrderType === AdditionalTradingOrderTypeEnum.STOP_LOSS && order.orderType === TradingOrderTypeEnum.MARKET
            ? 'STOP_MARKET'
            : order.additionalOrderType === AdditionalTradingOrderTypeEnum.STOP_LOSS && order.orderType === TradingOrderTypeEnum.LIMIT
            ? 'STOP'
            : order.additionalOrderType === AdditionalTradingOrderTypeEnum.TAKE_PROFIT && order.orderType === TradingOrderTypeEnum.MARKET
            ? 'TAKE_PROFIT_MARKET'
            : order.additionalOrderType === AdditionalTradingOrderTypeEnum.TAKE_PROFIT && order.orderType === TradingOrderTypeEnum.LIMIT
            ? 'TAKE_PROFIT'
            : order.orderType === TradingOrderTypeEnum.LIMIT
            ? 'LIMIT'
            : 'MARKET';
        const price = numberToString(order.price);
        let immediatelyError = false;

        while (true) {
          try {
            const { data } = await this.http.request({
              method: 'POST',
              url: '/fapi/v1/order',
              query: {
                symbol: `${order.tradePair.baseAsset}${order.tradePair.quoteAsset}`,
                side: order.side === TradingOrderSideEnum.BUY ? 'BUY' : 'SELL',
                type,
                newClientOrderId: order.orderId,
                newOrderRespType: 'RESULT',
                quantity: numberToString(order.baseAssetAmount),
                ...(order.positionSide ? { positionSide: order.positionSide } : {}),
                ...(['LIMIT', 'STOP', 'TAKE_PROFIT'].includes(type) ? { timeInForce: 'GTC' } : {}),
                ...(order.price && ['LIMIT', 'STOP', 'TAKE_PROFIT'].includes(type) ? { price } : {}),
                ...(order.price && ['STOP_MARKET', 'STOP', 'TAKE_PROFIT_MARKET', 'TAKE_PROFIT'].includes(type) ? { stopPrice: price } : {}),
              },
              headers: {
                ...credentials,
              },
            });

            return {
              exchangeOrderId: data.orderId.toString(),
              price: data.fills?.length
                ? calcAvgPrice({
                    data: data.fills.map(v => ({
                      price: parseFloat(v.price),
                      amount: parseFloat(v.qty),
                    })),
                  })
                : parseFloat(data.price) || parseFloat(price),
              immediatelyError,
            };
          } catch (error) {
            const errorData = parseJson({ data: error.message });

            if (immediatelyError || !errorData || Array.isArray(errorData) || !Object.values(allowErrorMessages).includes(errorData?.msg)) {
              throw error;
            }

            if (allowErrorMessages.immediatelyTrigger === errorData.msg) {
              Logger.warn(`Order ${order.orderId}, type "${type}" would immediately trigger, change type`);
              immediatelyError = true;
              type = ['TAKE_PROFIT_MARKET', 'TAKE_PROFIT_MARKET'].includes(type) ? TradingOrderTypeEnum.MARKET : TradingOrderTypeEnum.LIMIT;
            } else if (allowErrorMessages.internalError === errorData.msg) {
              Logger.warn(`Order ${order.orderId}, type "${type}" has binance internal error`);
            }
          }
        }
      }),
    ).then(result => ({
      result,
    }));
}
