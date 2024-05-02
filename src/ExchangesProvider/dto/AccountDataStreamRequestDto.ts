import { Field } from '@nmxjs/validation';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';
import { AccountDataStreamDto } from './AccountDataStreamDto';

export class AccountDataStreamRequestDto {
  @Field({
    type: ExchangeProviderCredentialsDto,
  })
  credentials: ExchangeProviderCredentialsDto;

  onData: (data: AccountDataStreamDto) => void;
}
