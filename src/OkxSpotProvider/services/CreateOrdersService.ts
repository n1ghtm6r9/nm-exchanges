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
import type { IOkxSpotHttpProvider } from '../interfaces';
import { okxSpotHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(okxSpotHttpProviderKey) protected readonly http: IOkxSpotHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
