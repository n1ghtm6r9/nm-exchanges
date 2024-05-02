import { Injectable, Inject } from '@nestjs/common';
import { calcAvgPrice, numberToString, parseJson } from '@nmxjs/utils';
import {
  CreateOrdersRequestDto,
  CreateOrdersResponseDto,
  LimitMakerError,
  AdditionalTradingOrderTypeEnum,
  MarketTypeEnum,
  TradingOrderSideEnum,
  TradingOrderTypeEnum,
  TradingProviderEnum,
} from '../../ExchangesProvider';
import type { IBybitSpotHttpProvider } from '../interfaces';
import { bybitSpotHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(bybitSpotHttpProviderKey) protected readonly http: IBybitSpotHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
