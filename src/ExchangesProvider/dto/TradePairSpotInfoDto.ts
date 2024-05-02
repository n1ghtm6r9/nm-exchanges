import { Field } from '@nmxjs/validation';
import { TradePairSpotMarginInfoDto } from './TradePairSpotMarginInfoDto';
import { DepositInfoDto } from './DepositInfoDto';
import { WithdrawInfoDto } from './WithdrawInfoDto';

export class TradePairSpotInfoDto {
  @Field({
    type: Boolean,
  })
  isFuturesAllowed: boolean;

  @Field({
    type: DepositInfoDto,
    array: true,
  })
  deposits: DepositInfoDto[];

  @Field({
    type: WithdrawInfoDto,
    array: true,
  })
  withdraws: WithdrawInfoDto[];

  @Field({
    type: TradePairSpotMarginInfoDto,
  })
  margin?: TradePairSpotMarginInfoDto;
}
