import { Field } from '@nmxjs/validation';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';
import { CreateOrdersOrderRequestDto } from './CreateOrdersOrderRequestDto';

export class CreateOrdersRequestDto {
  @Field({
    type: CreateOrdersOrderRequestDto,
    array: true,
  })
  orders: CreateOrdersOrderRequestDto[];

  @Field({
    type: ExchangeProviderCredentialsDto,
  })
  credentials: ExchangeProviderCredentialsDto;
}
