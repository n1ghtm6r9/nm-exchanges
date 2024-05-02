import { Field } from '@nmxjs/validation';
import { AccountDataStreamBalanceDataDto } from './AccountDataStreamBalanceDataDto';

export class AccountDataStreamBalanceDto {
  @Field({
    type: String,
  })
  type: 'balance';

  @Field({
    type: AccountDataStreamBalanceDataDto,
  })
  data: AccountDataStreamBalanceDataDto;
}
