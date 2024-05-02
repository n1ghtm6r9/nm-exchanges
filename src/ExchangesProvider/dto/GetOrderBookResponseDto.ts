import { Field } from '@nmxjs/validation';
import { RateAskBidDto } from './RateAskBidDto';

export class GetOrderBookResponseDto {
  @Field({
    type: RateAskBidDto,
    array: true,
  })
  asks: RateAskBidDto[];

  @Field({
    type: RateAskBidDto,
    array: true,
  })
  bids: RateAskBidDto[];
}
