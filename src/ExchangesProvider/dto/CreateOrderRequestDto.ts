import { Field } from '@nmxjs/validation';
import { AdditionalTradingOrderTypeEnum, PositionEnum, TradingOrderSideEnum, TradingOrderTypeEnum } from '../interfaces';
import { SimpleTradePairDto } from './SimpleTradePairDto';
import { ExchangeProviderCredentialsDto } from './ExchangeProviderCredentialsDto';

export class CreateOrderRequestDto {
  @Field({
    type: String,
  })
  orderId: string;

  @Field({
    type: { TradingOrderSideEnum },
    enum: true,
  })
  side: TradingOrderSideEnum;

  @Field({
    type: { PositionEnum },
    enum: true,
    nullable: true,
  })
  positionSide?: PositionEnum;

  @Field({
    type: { TradingOrderTypeEnum },
    enum: true,
  })
  orderType: TradingOrderTypeEnum;

  @Field({
    type: { AdditionalTradingOrderTypeEnum },
    enum: true,
    nullable: true,
  })
  additionalOrderType?: AdditionalTradingOrderTypeEnum;

  @Field({
    type: Number,
    nullable: true,
  })
  price?: number;

  @Field({
    type: SimpleTradePairDto,
  })
  tradePair: SimpleTradePairDto;

  @Field({
    type: Number,
  })
  baseAssetAmount: number;

  @Field({
    type: Number,
  })
  quoteAssetAmount: number;

  @Field({
    type: ExchangeProviderCredentialsDto,
  })
  credentials: ExchangeProviderCredentialsDto;
}
