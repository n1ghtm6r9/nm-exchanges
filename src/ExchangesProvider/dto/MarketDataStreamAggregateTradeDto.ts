import { Field } from '@nmxjs/validation';
import { MarketDataStreamAggregateTradeDataDto } from './MarketDataStreamAggregateTradeDataDto';

export class MarketDataStreamAggregateTradeDto {
  @Field({
    type: String,
  })
  type: 'aggregateTrade';

  @Field({
    type: MarketDataStreamAggregateTradeDataDto,
  })
  data: MarketDataStreamAggregateTradeDataDto;
}
