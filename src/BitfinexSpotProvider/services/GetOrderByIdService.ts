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
import type { IBitfinexSpotHttpProvider } from '../interfaces';
import { bitfinexSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderByIdService {
  constructor(@Inject(bitfinexSpotHttpProviderKey) protected readonly http: IBitfinexSpotHttpProvider) {}

  public async call({ orderId, tradePair, credentials }: GetOrderByIdRequestDto): Promise<GetOrderByIdResponseDto> {
    return;
  }
}
