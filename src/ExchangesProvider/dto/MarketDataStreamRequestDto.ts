import { Field } from '@nmxjs/validation';
import type { MarketDataStreamRequestMethodDto } from './MarketDataStreamRequestMethodDto';
import { MarketDataStreamDto } from './MarketDataStreamDto';

export class MarketDataStreamRequestDto {
  @Field({
    type: Object,
    array: true,
  })
  methods: MarketDataStreamRequestMethodDto[];

  onData: (data: MarketDataStreamDto) => void;
}
