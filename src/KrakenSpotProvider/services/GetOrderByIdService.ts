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
import type { IKrakenSpotHttpProvider } from '../interfaces';
import { krakenSpotHttpProviderKey } from '../constants';

@Injectable()
export class GetOrderByIdService {
  constructor(@Inject(krakenSpotHttpProviderKey) protected readonly http: IKrakenSpotHttpProvider) {}

  public async call({ orderId, tradePair, credentials }: GetOrderByIdRequestDto): Promise<GetOrderByIdResponseDto> {
    return;
  }
}
