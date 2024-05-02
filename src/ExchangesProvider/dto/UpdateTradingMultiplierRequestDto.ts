import { Field } from '@nmxjs/validation';
import { TradingMarginTypeEnum } from '../interfaces';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class UpdateTradingMultiplierRequestDto {
  @Field({
    type: Number,
  })
  tradingMultiplier: number;

  @Field({
    type: { TradingMarginTypeEnum },
    enum: true,
  })
  marginType: TradingMarginTypeEnum;

  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

  @Field({
    type: ExchangeProviderCredentialsDto,
  })
  credentials: ExchangeProviderCredentialsDto;
}
