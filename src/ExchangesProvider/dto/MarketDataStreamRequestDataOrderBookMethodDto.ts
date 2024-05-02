import { Field } from '@nmxjs/validation';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class MarketDataStreamRequestDataOrderBookMethodDto {
  @Field({
    type: String,
  })
  name: 'orderBook';

  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;
}
