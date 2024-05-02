import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetOrderByIdRequestDto,
  GetOrderByIdResponseDto,
  AdditionalTradingOrderTypeEnum,
  MarketTypeEnum,
  PositionEnum,
  TradingOrderSideEnum,
  TradingOrderStatusEnum,
  TradingOrderTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IKucoinFuturesHttpProvider } from '../interfaces';
import { kucoinFuturesHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderByIdService {
  constructor(@Inject(kucoinFuturesHttpProviderKey) protected readonly http: IKucoinFuturesHttpProvider) {}

  public async call({ orderId, tradePair, credentials }: GetOrderByIdRequestDto): Promise<GetOrderByIdResponseDto> {
    return;
  }
}
