import { parseJson } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto } from '../../ExchangesProvider';
import type { IBitfinexFuturesHttpProvider } from '../interfaces';
import { bitfinexFuturesHttpProviderKey } from '../constants';

@Injectable()
export class UpdateTradingMultiplierService {
  constructor(@Inject(bitfinexFuturesHttpProviderKey) protected readonly http: IBitfinexFuturesHttpProvider) {}

  public call = ({
    tradingMultiplier,
    marginType,
    tradePair,
    credentials,
  }: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> => {
    return;
  };
}
