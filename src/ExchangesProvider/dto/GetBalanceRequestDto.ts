import { Field } from '@nmxjs/validation';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';

export class GetBalanceRequestDto {
  @Field({
    type: String,
  })
  asset: string;

  @Field({
    type: ExchangeProviderCredentialsDto,
  })
  credentials: ExchangeProviderCredentialsDto;
}
