import { Field } from '@nmxjs/validation';

export class TradePairFuturesInfoDto {
  @Field({
    type: Number,
  })
  fundingRate: number;

  @Field({
    type: Number,
  })
  fundingIntervalHours: number;

  @Field({
    type: Number,
  })
  nextFundingTime: number;
}
