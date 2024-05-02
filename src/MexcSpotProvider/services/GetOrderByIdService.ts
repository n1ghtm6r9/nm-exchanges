import math from 'big.js';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetOrderByIdRequestDto,
  GetOrderByIdResponseDto,
  AdditionalTradingOrderTypeEnum,
  MarketTypeEnum,
  TradingOrderSideEnum,
  TradingOrderStatusEnum,
  TradingOrderTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IMexcSpotHttpProvider } from '../interfaces';
import { mexcSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderByIdService {
  constructor(@Inject(mexcSpotHttpProviderKey) protected readonly http: IMexcSpotHttpProvider) {}

  public async call({ orderId, tradePair, credentials }: GetOrderByIdRequestDto): Promise<GetOrderByIdResponseDto> {
    return;
  }
}
