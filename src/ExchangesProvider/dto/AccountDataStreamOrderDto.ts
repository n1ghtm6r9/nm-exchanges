import { Field } from '@nmxjs/validation';
import { ExchangeOrderDto } from './ExchangeOrderDto';

export class AccountDataStreamOrderDto {
  @Field({
    type: String,
  })
  type: 'order';

  @Field({
    type: ExchangeOrderDto,
  })
  data: ExchangeOrderDto;
}
