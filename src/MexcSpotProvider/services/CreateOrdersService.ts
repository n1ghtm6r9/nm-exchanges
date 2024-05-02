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
import type { IMexcSpotHttpProvider } from '../interfaces';
import { mexcSpotHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(mexcSpotHttpProviderKey) protected readonly http: IMexcSpotHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
