import { Injectable } from '@nestjs/common';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto } from '../../ExchangesProvider';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';

@Injectable()
export class GetTradePairInfoService {
  constructor(protected readonly getTradePairsInfoService: GetTradePairsInfoService) {}

  public call = ({ tradePair, proxy, credentials }: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto> =>
    this.getTradePairsInfoService
      .call({
        proxy,
        credentials,
      })
      .then(res => res.data.find(v => v.symbol === `${tradePair.baseAsset}${tradePair.quoteAsset}`));
}
