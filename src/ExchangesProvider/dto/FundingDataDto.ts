import { Field } from '@nmxjs/validation';

export class FundingDataDto {
  @Field({
    type: Number,
  })
  time: number;

  @Field({
    type: Number,
  })
  fundingRate: number;
}
