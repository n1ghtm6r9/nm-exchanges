import { Field } from '@nmxjs/validation';

export class ExchangeProviderCredentialsDto {
  @Field({
    type: String,
  })
  publicKey: string;

  @Field({
    type: String,
  })
  secretKey: string;
}
