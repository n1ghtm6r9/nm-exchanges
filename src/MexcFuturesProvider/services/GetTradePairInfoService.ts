import { Injectable, Inject } from '@nestjs/common';
import { GetTradePairsInfoService } from './GetTradePairsInfoService';
import { getPrecision } from '@nmxjs/utils';
import type { IMexcFuturesHttpProvider } from '../interfaces';
import { GetTradePairInfoRequestDto, GetTradePairInfoResponseDto, MarketTypeEnum, TradingProviderEnum } from '../../ExchangesProvider';
import { mexcFuturesHttpProviderKey, mexcFuturesIntervals } from '../constants';

@Injectable()
export class GetTradePairInfoService {
  constructor(
    @Inject(mexcFuturesHttpProviderKey) protected readonly http: IMexcFuturesHttpProvider,
    protected readonly getTradePairsInfoService: GetTradePairsInfoService,
  ) {}

  public call = ({ tradePair, proxy }: GetTradePairInfoRequestDto): Promise<GetTradePairInfoResponseDto> =>
    this.http
      .request({
        url: '/api/v1/contract/detail',
        query: {
          symbol: `${tradePair.baseAsset}_${tradePair.quoteAsset}`,
        },
        headers: {
          proxy,
        },
      })
      .then(request => request.data.data)
      .then(tradePairInfo => ({
        symbol: tradePairInfo.symbol,
        provider: TradingProviderEnum.MEXC,
        marketType: MarketTypeEnum.FUTURES,
        baseAsset: tradePairInfo.baseCoinName,
        quoteAsset: tradePairInfo.quoteCoinName,
        intervals: mexcFuturesIntervals,
        pricePrecision: getPrecision(tradePairInfo.priceUnit),
        baseAssetPrecision: getPrecision(tradePairInfo.contractSize),
        quoteAssetPrecision: tradePairInfo.amountScale,
        isMarginAllowed: false,
        deposits: [],
        withdraws: [],
        makerCommissionPercent: 0,
        takerCommissionPercent: 0,
      }));
}
