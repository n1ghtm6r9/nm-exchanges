import { Injectable, Inject } from '@nestjs/common';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto } from '../../ExchangesProvider';
import type { IBybitFuturesHttpProvider } from '../interfaces';
import { bybitFuturesHttpProviderKey } from '../constants';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';

@Injectable()
export class GetTradePairInfoService {
  constructor(
    @Inject(bybitFuturesHttpProviderKey) protected readonly http: IBybitFuturesHttpProvider,
    protected readonly getTradePairsInfoService: GetTradePairsInfoService
  ) {}

  public call = ({ tradePair, proxy }: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto> => {
    return;
  };
}
