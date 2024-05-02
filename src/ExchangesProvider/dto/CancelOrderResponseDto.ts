import { Field } from '@nmxjs/validation';

export class CancelOrderResponseDto {
  @Field({
    type: Boolean,
  })
  ok: boolean;
}
