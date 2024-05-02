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
import type { IWhiteSpotHttpProvider } from '../interfaces';
import { whitebitSpotHttpProviderKey } from '../constants';

@Injectable()
export class CreateOrdersService {
  constructor(@Inject(whitebitSpotHttpProviderKey) protected readonly http: IWhiteSpotHttpProvider) {}

  public call = ({ orders, credentials }: CreateOrdersRequestDto): Promise<CreateOrdersResponseDto> => {
    return;
  };
}
