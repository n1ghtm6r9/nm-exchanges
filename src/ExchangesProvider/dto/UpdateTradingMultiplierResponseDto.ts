import { Field } from '@nmxjs/validation';

export class UpdateTradingMultiplierResponseDto {
  @Field({
    type: Boolean,
  })
  ok: boolean;
}
