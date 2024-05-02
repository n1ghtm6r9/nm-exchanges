import { Field } from '@nmxjs/validation';

export class TradePairSpotMarginInfoDto {
  @Field({
    type: Number,
  })
  borrowLimit: number;

  @Field({
    type: Number,
  })
  hourlyInterestPercent: number;
}
