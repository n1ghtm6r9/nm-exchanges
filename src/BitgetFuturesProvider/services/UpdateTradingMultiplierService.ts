import { parseJson } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto } from '../../ExchangesProvider';
import type { IBitgetFuturesHttpProvider } from '../interfaces';
import { bitgetFuturesHttpProviderKey } from '../constants';

@Injectable()
export class UpdateTradingMultiplierService {
  constructor(@Inject(bitgetFuturesHttpProviderKey) protected readonly http: IBitgetFuturesHttpProvider) {}

  public call = ({
    tradingMultiplier,
    marginType,
    tradePair,
    credentials,
  }: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> => {
    return;
  };
}
