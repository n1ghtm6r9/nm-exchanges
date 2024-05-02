import { Injectable, Inject } from '@nestjs/common';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto } from '../../ExchangesProvider';
import type { IBitfinexFuturesHttpProvider } from '../interfaces';
import { bitfinexFuturesHttpProviderKey } from '../constants';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';

@Injectable()
export class GetTradePairInfoService {
  constructor(
    @Inject(bitfinexFuturesHttpProviderKey) protected readonly http: IBitfinexFuturesHttpProvider,
    protected readonly getTradePairsInfoService: GetTradePairsInfoService
  ) {}

  public call = ({ tradePair, proxy }: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto> => {
    return;
  };
}
