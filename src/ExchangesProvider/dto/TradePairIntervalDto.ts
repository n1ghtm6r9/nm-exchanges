import { Field } from '@nmxjs/validation';
import { TradePairTimeIntervalEnum } from '../interfaces';

export class TradePairIntervalDto {
  @Field({
    type: Number,
  })
  value: number;

  @Field({
    type: { TradePairTimeIntervalEnum },
    enum: true,
  })
  type: TradePairTimeIntervalEnum;
}
