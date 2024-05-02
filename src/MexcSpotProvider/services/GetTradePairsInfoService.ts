import { getPrecision } from '@nmxjs/utils';
import { Injectable, Inject } from '@nestjs/common';
import {
  GetTradePairsInfoRequestDto,
  GetTradePairInfoResponseDto,
  GetTradePairsInfoResponseDto,
  DepositInfoDto,
  MarketTypeEnum,
  TradingProviderEnum,
  WithdrawInfoDto,
} from '../../ExchangesProvider';
import type { IMexcSpotHttpProvider } from '../interfaces';
import { mexcSpotHttpProviderKey, mexcSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  protected readonly networkMap = {
    'BEP20(BSC)': 'BEP20',
    'Arbitrum One': 'ARBITRUM',
    'Chiliz Chain(CHZ)': 'CHZ',
    AVAX_CCHAIN: 'AVAXC',
    'Darwinia Smart Chain': 'DARWINIA',
    'BSC(RACAV1)': 'BEP20',
    'BSC(RACAV2)': 'BEP20',
    'Arbitrum One(Bridged)': 'ARBITRUM',
    Khala: 'KHALA',
    'UGAS(Ultrain)': 'UGAS',
    AVAX_XCHAIN: 'AVAX',
    'f(x)Core': 'FX',
    BSC: 'BEP2',
    'BSC(BEP20)': 'BEP20',
    MEVerse: 'MEV',
    'zkSync Lite(v1)': 'ZKSYNC',
    'RAP20 (Rangers Mainnet)': 'RAP20',
  };

  constructor(@Inject(mexcSpotHttpProviderKey) protected readonly http: IMexcSpotHttpProvider) {}

  public call = async ({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/api/v3/exchangeInfo',
        })
        .then(response => response.data.symbols),
      credentials
        ? await this.http
            .request({
              url: '/api/v3/capital/config/getall',
              headers: credentials,
            })
            .then(response => response.data)
        : [],
    ]).then(([tradePairsInfo, depositWithdrawInfos]) => ({
      data: tradePairsInfo
        .filter(s => s.status === 'ENABLED' && s.permissions.includes('SPOT'))
        .map((tradePairInfo): GetTradePairInfoResponseDto => {
          const depositWithdrawInfo = depositWithdrawInfos.find(v => v.coin === tradePairInfo.baseAsset)?.networkList || [];
          return {
            symbol: tradePairInfo.symbol,
            provider: TradingProviderEnum.MEXC,
            marketType: MarketTypeEnum.SPOT,
            baseAsset: tradePairInfo.baseAsset,
            quoteAsset: tradePairInfo.quoteAsset,
            intervals: mexcSpotIntervals,
            pricePrecision: tradePairInfo.quotePrecision,
            baseAssetPrecision: tradePairInfo.baseAssetPrecision,
            quoteAssetPrecision: tradePairInfo.quoteAssetPrecision,
            makerCommissionPercent: parseFloat(tradePairInfo.makerCommission),
            takerCommissionPercent: parseFloat(tradePairInfo.takerCommission),
            spot: {
              deposits: depositWithdrawInfo
                .filter(v => v.depositEnable)
                .map(
                  (v): DepositInfoDto => ({
                    network: this.networkMap[v.network] || v.network,
                  }),
                ),
              withdraws: depositWithdrawInfo
                .filter(v => v.withdrawEnable)
                .map(
                  (v): WithdrawInfoDto => ({
                    network: this.networkMap[v.network] || v.network,
                    min: parseFloat(v.withdrawMin),
                    commissionSum: parseFloat(v.withdrawFee),
                    precision: getPrecision(parseFloat(v.withdrawMin)),
                    extraCommissionPercent: 0,
                  }),
                ),
            },
          };
        }),
    }));
}
