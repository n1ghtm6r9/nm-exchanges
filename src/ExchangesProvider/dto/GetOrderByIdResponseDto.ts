import { Field } from '@nmxjs/validation';
import { ExchangeOrderDto } from './ExchangeOrderDto';

export class GetOrderByIdResponseDto {
  @Field({
    type: ExchangeOrderDto,
  })
  order: ExchangeOrderDto;
}
