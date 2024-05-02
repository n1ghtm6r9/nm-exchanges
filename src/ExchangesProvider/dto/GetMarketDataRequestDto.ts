import { Field } from '@nmxjs/validation';
import { SimpleTradePairWithIntervalDto } from './SimpleTradePairWithIntervalDto';

export class GetMarketDataRequestDto {
  @Field({
    type: SimpleTradePairWithIntervalDto,
  })
  tradePair: SimpleTradePairWithIntervalDto;

  @Field({
    type: Boolean,
    nullable: true,
  })
  proxy?: boolean;

  @Field({
    type: Number,
    nullable: true,
  })
  startTime?: number;

  @Field({
    type: Number,
    nullable: true,
  })
  endTime?: number;

  @Field({
    type: Number,
    nullable: true,
  })
  limit?: number;

  @Field({
    type: Number,
    nullable: true,
  })
  offset?: number;
}
