import { Field } from '@nmxjs/validation';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class GetFundingDataRequestDto {
  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

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
