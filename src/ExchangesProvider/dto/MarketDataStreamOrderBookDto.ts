import { Field } from '@nmxjs/validation';
import { MarketDataStreamOrderBookDataDto } from './MarketDataStreamOrderBookDataDto';

export class MarketDataStreamOrderBookDto {
  @Field({
    type: String,
  })
  type: 'orderBook';

  @Field({
    type: MarketDataStreamOrderBookDataDto,
  })
  data: MarketDataStreamOrderBookDataDto;
}
