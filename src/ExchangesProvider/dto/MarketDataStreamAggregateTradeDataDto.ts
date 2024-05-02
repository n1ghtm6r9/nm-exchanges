import { Field } from '@nmxjs/validation';
import { TradingOrderSideEnum, TradingProviderEnum } from '../interfaces';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class MarketDataStreamAggregateTradeDataDto {
  @Field({
    type: { TradingOrderSideEnum },
    enum: true,
  })
  side: TradingOrderSideEnum;

  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

  @Field({
    type: Number,
  })
  price: number;

  @Field({
    type: Number,
  })
  quantity: number;

  @Field({
    type: { TradingProviderEnum },
    enum: true,
  })
  provider: TradingProviderEnum;
}
