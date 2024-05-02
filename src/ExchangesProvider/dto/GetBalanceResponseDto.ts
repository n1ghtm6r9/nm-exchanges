import { Field } from '@nmxjs/validation';

export class GetBalanceResponseDto {
  @Field({
    type: Number,
  })
  amount: number;
}
