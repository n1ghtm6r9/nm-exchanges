import { Field } from '@nmxjs/validation';
import { SimpleTradePairDto } from './SimpleTradePairDto';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';

export class GetTradePairInfoRequestDto {
  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

  @Field({
    type: Boolean,
    nullable: true,
  })
  proxy?: boolean;

  @Field({
    type: ExchangeProviderCredentialsDto,
    nullable: true,
  })
  credentials?: ExchangeProviderCredentialsDto;
}
