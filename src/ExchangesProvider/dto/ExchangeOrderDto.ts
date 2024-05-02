import { Field } from '@nmxjs/validation';
import {
  PositionEnum,
  MarketTypeEnum,
  TradingOrderTypeEnum,
  TradingOrderStatusEnum,
  TradingProviderEnum,
  TradingOrderSideEnum,
  AdditionalTradingOrderTypeEnum,
} from '../interfaces';

export class ExchangeOrderDto {
  @Field({
    type: String,
  })
  id: string;

  @Field({
    type: String,
  })
  orderId: string;

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
    type: Number,
  })
  price: number;

  @Field({
    type: { TradingOrderStatusEnum },
    enum: true,
  })
  status: TradingOrderStatusEnum;

  @Field({
    type: { TradingOrderTypeEnum },
    enum: true,
  })
  orderType: TradingOrderTypeEnum;

  @Field({
    type: { AdditionalTradingOrderTypeEnum },
    enum: true,
  })
  additionalOrderType: AdditionalTradingOrderTypeEnum;

  @Field({
    type: Number,
  })
  baseAssetAmount: number;

  @Field({
    type: Number,
  })
  quoteAssetAmount: number;

  @Field({
    type: Number,
    nullable: true,
  })
  commissionAmount?: number;

  @Field({
    type: String,
    nullable: true,
  })
  commissionAsset?: string;

  @Field({
    type: Number,
  })
  createdAt: number;

  @Field({
    type: Number,
  })
  updatedAt: number;
}
