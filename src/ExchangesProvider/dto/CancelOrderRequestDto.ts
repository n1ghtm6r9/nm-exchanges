import { Field } from '@nmxjs/validation';
import { SimpleTradePairDto } from './SimpleTradePairDto';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';

export class CancelOrderRequestDto {
  @Field({
    type: String,
  })
  orderId: string;

  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

  @Field({
    type: ExchangeProviderCredentialsDto,
  })
  credentials: ExchangeProviderCredentialsDto;
}
