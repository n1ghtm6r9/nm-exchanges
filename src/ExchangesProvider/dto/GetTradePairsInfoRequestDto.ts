import { Field } from '@nmxjs/validation';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';

export class GetTradePairsInfoRequestDto {
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
