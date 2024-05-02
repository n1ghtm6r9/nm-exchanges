import { Field } from '@nmxjs/validation';

export class DepositInfoDto {
  @Field({
    type: String,
  })
  network: string;
}
