import { Field } from '@nmxjs/validation';
import { MarketTypeEnum, TradingProviderEnum } from '../interfaces';
import { TradePairIntervalDto } from './TradePairIntervalDto';
import { TradePairFuturesInfoDto } from './TradePairFuturesInfoDto';
import { TradePairSpotInfoDto } from './TradePairSpotInfoDto';

export class GetTradePairInfoResponseDto {
  @Field({
    type: String,
  })
  symbol: string;

  @Field({
    type: String,
  })
  baseAsset: string;

  @Field({
    type: String,
  })
  quoteAsset: string;

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
    type: TradePairIntervalDto,
    array: true,
  })
  intervals: TradePairIntervalDto[];

  @Field({
    type: Number,
  })
  pricePrecision: number;

  @Field({
    type: Number,
  })
  baseAssetPrecision: number;

  @Field({
    type: Number,
  })
  quoteAssetPrecision: number;

  @Field({
    type: Number,
  })
  makerCommissionPercent: number;

  @Field({
    type: Number,
  })
  takerCommissionPercent: number;

  @Field({
    type: TradePairSpotInfoDto,
    nullable: true,
  })
  spot?: Omit<TradePairSpotInfoDto, 'isFuturesAllowed'>;

  @Field({
    type: TradePairFuturesInfoDto,
    nullable: true,
  })
  futures?: TradePairFuturesInfoDto;
}
