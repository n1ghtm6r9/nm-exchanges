import { Field } from '@nmxjs/validation';
import { TradePairIntervalDto } from './TradePairIntervalDto';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class SimpleTradePairWithIntervalDto extends SimpleTradePairDto {
  @Field({
    type: TradePairIntervalDto,
  })
  interval: TradePairIntervalDto;
}
