import { Field } from '@nmxjs/validation';
import { MarketDataPriceKeysDto } from './MarketDataPriceKeysDto';

export class MarketDataDto extends MarketDataPriceKeysDto {
  @Field({
    type: Number,
  })
  time: number;

  @Field({
    type: Number,
  })
  volumeBaseAsset: number;

  @Field({
    type: Number,
  })
  volumeQuoteAsset: number;

  @Field({
    type: Number,
    nullable: true,
  })
  tradeCount?: number;

  @Field({
    type: MarketDataPriceKeysDto,
    nullable: true,
  })
  heikenAshi?: MarketDataPriceKeysDto;
}
