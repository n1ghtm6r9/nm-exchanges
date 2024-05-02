import { parseJson } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto } from '../../ExchangesProvider';
import type { IWhitebitFuturesHttpProvider } from '../interfaces';
import { whitebitFuturesHttpProviderKey } from '../constants';

@Injectable()
export class UpdateTradingMultiplierService {
  constructor(@Inject(whitebitFuturesHttpProviderKey) protected readonly http: IWhitebitFuturesHttpProvider) {}

  public call = ({
    tradingMultiplier,
    marginType,
    tradePair,
    credentials,
  }: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> => {
    return;
  };
}
