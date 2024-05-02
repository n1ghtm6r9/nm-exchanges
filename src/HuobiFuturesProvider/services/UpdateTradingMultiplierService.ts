import { parseJson } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto } from '../../ExchangesProvider';
import type { IHuobiFuturesHttpProvider } from '../interfaces';
import { huobiFuturesHttpProviderKey } from '../constants';

@Injectable()
export class UpdateTradingMultiplierService {
  constructor(@Inject(huobiFuturesHttpProviderKey) protected readonly http: IHuobiFuturesHttpProvider) {}

  public call = ({
    tradingMultiplier,
    marginType,
    tradePair,
    credentials,
  }: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> => {
    return;
  };
}
