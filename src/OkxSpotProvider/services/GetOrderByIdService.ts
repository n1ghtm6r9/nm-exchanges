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
import type { IOkxSpotHttpProvider } from '../interfaces';
import { okxSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderByIdService {
  constructor(@Inject(okxSpotHttpProviderKey) protected readonly http: IOkxSpotHttpProvider) {}

  public async call({ orderId, tradePair, credentials }: GetOrderByIdRequestDto): Promise<GetOrderByIdResponseDto> {
    return;
  }
}
