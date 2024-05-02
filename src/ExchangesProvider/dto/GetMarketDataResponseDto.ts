import { Field } from '@nmxjs/validation';
import { MarketDataDto } from './MarketDataDto';

export class GetMarketDataResponseDto {
  @Field({
    type: MarketDataDto,
    array: true,
  })
  marketData: MarketDataDto[];
}
