import { Field } from '@nmxjs/validation';
import { CreateOrderResponseDto } from './CreateOrderResponseDto';

export class CreateOrdersResponseDto {
  @Field({
    type: CreateOrderResponseDto,
    array: true,
  })
  result: CreateOrderResponseDto[];
}
