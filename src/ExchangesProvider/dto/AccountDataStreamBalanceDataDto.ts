import { Field } from '@nmxjs/validation';
import { MarketTypeEnum } from '../../ExchangesProvider';

export class AccountDataStreamBalanceDataDto {
  @Field({
    type: String,
  })
  asset: string;

  @Field({
    type: Number,
  })
  amount: number;

  @Field({
    type: { MarketTypeEnum },
    enum: true,
  })
  marketType: MarketTypeEnum;
}
