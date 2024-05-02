import { Field } from '@nmxjs/validation';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class MarketDataStreamRequestDataAggregateTradeMethodDto {
  @Field({
    type: String,
  })
  name: 'aggregateTrade';

  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;
}
