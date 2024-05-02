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
import type { IBitfinexSpotHttpProvider } from '../interfaces';
import { bitfinexSpotHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(bitfinexSpotHttpProviderKey) protected readonly http: IBitfinexSpotHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
