import { Field } from '@nmxjs/validation';
import { DepositInfoDto } from './DepositInfoDto';

export class WithdrawInfoDto extends DepositInfoDto {
  @Field({
    type: Number,
  })
  min: number;

  @Field({
    type: Number,
  })
  commissionSum: number;

  @Field({
    type: Number,
  })
  extraCommissionPercent: number;

  @Field({
    type: Number,
  })
  precision: number;
}
