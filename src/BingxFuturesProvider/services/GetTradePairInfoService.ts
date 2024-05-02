import { Injectable, Inject } from '@nestjs/common';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto } from '../../ExchangesProvider';
import type { IBingxFuturesHttpProvider } from '../interfaces';
import { bingxFuturesHttpProviderKey } from '../constants';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';

@Injectable()
export class GetTradePairInfoService {
  constructor(
    @Inject(bingxFuturesHttpProviderKey) protected readonly http: IBingxFuturesHttpProvider,
    protected readonly getTradePairsInfoService: GetTradePairsInfoService
  ) {}

  public call = ({ tradePair, proxy }: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto> => {
    return;
  };
}
