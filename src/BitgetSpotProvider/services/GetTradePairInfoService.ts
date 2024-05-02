import { Injectable, Inject } from '@nestjs/common';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto } from '../../ExchangesProvider';
import type { IBitgetSpotHttpProvider } from '../interfaces';
import { bitgetSpotHttpProviderKey } from '../constants';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';

@Injectable()
export class GetTradePairInfoService {
  constructor(
    @Inject(bitgetSpotHttpProviderKey) protected readonly http: IBitgetSpotHttpProvider,
    protected readonly getTradePairsInfoService: GetTradePairsInfoService
  ) {}

  public call = ({ tradePair, proxy, credentials }: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto> =>
    this.getTradePairsInfoService
      .call({
        proxy,
        credentials,
      })
      .then(res => res.data.find(v => v.symbol === `${tradePair.baseAsset}-${tradePair.quoteAsset}`));
}
