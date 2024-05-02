import { Field } from '@nmxjs/validation';
import { SimpleTradePairDto } from './SimpleTradePairDto';
import { MarketTypeEnum, TradingProviderEnum } from '../interfaces';

export class TradePairDto extends SimpleTradePairDto {
  @Field({
    type: { TradingProviderEnum },
    enum: true,
  })
  provider: TradingProviderEnum;

  @Field({
    type: { MarketTypeEnum },
    enum: true,
  })
  marketType: MarketTypeEnum;
}
