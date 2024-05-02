import { Field } from '@nmxjs/validation';

export class CreateOrderResponseDto {
  @Field({
    type: String,
  })
  exchangeOrderId: string;

  @Field({
    type: Boolean,
    nullable: true,
  })
  immediatelyError?: boolean;

  @Field({
    type: Number,
  })
  price: number;
}
