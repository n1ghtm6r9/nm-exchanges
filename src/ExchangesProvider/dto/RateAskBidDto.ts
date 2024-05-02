import { Field } from '@nmxjs/validation';

export class RateAskBidDto {
  @Field({
    type: Number,
  })
  price: number;

  @Field({
    type: Number,
  })
  volumeBaseAsset: number;

  @Field({
    type: Number,
  })
  volumeQuoteAsset: number;
}
