import { Field } from '@nmxjs/validation';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class GetOrderBookRequestDto {
  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

  @Field({
    type: Number,
  })
  limit: number;

  @Field({
    type: Boolean,
    nullable: true,
  })
  proxy?: boolean;
}
