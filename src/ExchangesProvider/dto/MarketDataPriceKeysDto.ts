import { Field } from '@nmxjs/validation';
import { MarketDataPriceKeyEnum } from '../interfaces';

type MarketDataMainFields = { -readonly [key in keyof typeof MarketDataPriceKeyEnum]: number };

export class MarketDataPriceKeysDto implements MarketDataMainFields {
  @Field({
    type: Number,
  })
  close: number;

  @Field({
    type: Number,
  })
  high: number;

  @Field({
    type: Number,
  })
  low: number;

  @Field({
    type: Number,
  })
  open: number;
}
