import { Injectable, Inject } from '@nestjs/common';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto } from '../../ExchangesProvider';
import type { IWhitebitFuturesHttpProvider } from '../interfaces';
import { whitebitFuturesHttpProviderKey } from '../constants';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';

@Injectable()
export class GetTradePairInfoService {
  constructor(
    @Inject(whitebitFuturesHttpProviderKey) protected readonly http: IWhitebitFuturesHttpProvider,
    protected readonly getTradePairsInfoService: GetTradePairsInfoService
  ) {}

  public call = ({ tradePair, proxy }: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto> => {
    return;
  };
}
