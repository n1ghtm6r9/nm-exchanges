import { Injectable, Inject } from '@nestjs/common';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto } from '../../ExchangesProvider';
import type { IWhiteSpotHttpProvider } from '../interfaces';
import { whitebitSpotHttpProviderKey } from '../constants';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';

@Injectable()
export class GetTradePairInfoService {
  constructor(
    @Inject(whitebitSpotHttpProviderKey) protected readonly http: IWhiteSpotHttpProvider,
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
