import { parseJson } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto } from '../../ExchangesProvider';
import type { IBybitFuturesHttpProvider } from '../interfaces';
import { bybitFuturesHttpProviderKey } from '../constants';

@Injectable()
export class UpdateTradingMultiplierService {
  constructor(@Inject(bybitFuturesHttpProviderKey) protected readonly http: IBybitFuturesHttpProvider) {}

  public call = ({
    tradingMultiplier,
    marginType,
    tradePair,
    credentials,
  }: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> => {
    return;
  };
}
