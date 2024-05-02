import { Field } from '@nmxjs/validation';
import { MarketTypeEnum, TradingProviderEnum } from '../interfaces';
import { RateAskBidDto } from './RateAskBidDto';
import { SimpleTradePairDto } from './SimpleTradePairDto';

export class MarketDataStreamOrderBookDataDto {
  @Field({
    type: { TradingProviderEnum },
    enum: true,
  })
  provider: TradingProviderEnum;

  @Field({
    type: { MarketTypeEnum },
    enum: true,
  })
  marketType: MarketTypeEnum;

  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

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

  @Field({
    type: Number,
  })
  lastUpdatedId: number;

  @Field({
    type: Number,
  })
  time: number;
}
