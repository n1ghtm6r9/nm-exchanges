import { Field } from '@nmxjs/validation';

export class SimpleTradePairDto {
  @Field({
    type: String,
  })
  baseAsset: string;

  @Field({
    type: String,
  })
  quoteAsset: string;
}
