import math from 'big.js';
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
import type { IBinanceSpotHttpProvider } from '../interfaces';
import { binanceSpotHttpProviderKey, binanceSpotIntervals } from '../constants';

@Injectable()
export class GetTradePairsInfoService {
  protected readonly networkMap = {
    ETH: 'ERC20',
    FIAT_MONEY: 'FIAT',
    BSC: 'BEP20',
    BNB: 'BEP2',
    TRX: 'TRC20',
  };

  constructor(@Inject(binanceSpotHttpProviderKey) protected readonly http: IBinanceSpotHttpProvider) {}

  public call = ({ proxy, credentials }: GetTradePairsInfoRequestDto = {}): Promise<GetTradePairsInfoResponseDto> =>
    Promise.all([
      this.http
        .request({
          url: '/api/v3/exchangeInfo',
          headers: {
            proxy,
          },
        })
        .then(response => response.data.symbols),
      credentials
        ? this.http
            .request({
              url: '/sapi/v1/asset/tradeFee',
              headers: {
                ...credentials,
              },
            })
            .then(res =>
              res.data.map(d => ({
                symbol: d.symbol,
                makerCommissionPercent: math(parseFloat(d.makerCommission)).mul(100).toNumber(),
                takerCommissionPercent: math(parseFloat(d.takerCommission)).mul(100).toNumber(),
              })),
            )
        : [],
      credentials
        ? this.http
            .request({
              url: '/sapi/v1/margin/crossMarginData',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data)
        : [],
      credentials
        ? this.http
            .request({
              url: '/sapi/v1/capital/config/getall',
              headers: {
                ...credentials,
              },
            })
            .then(res => res.data)
        : [],
    ]).then(([tradePairsInfo, commissions, crossMarginData, depositWithdrawInfos]) => ({
      data: tradePairsInfo
        .filter(s => s.status === 'TRADING' && (!s.permissions.length || s.permissions.includes('SPOT')))
        .map((tradePairInfo): GetTradePairInfoResponseDto => {
          const commission = commissions.find(v => v.symbol === tradePairInfo.symbol);
          const depositWithdrawInfo = depositWithdrawInfos.find(v => v.coin === tradePairInfo.baseAsset)?.networkList || [];
          const marginInfo = crossMarginData.find(v => v.coin === tradePairInfo.baseAsset);
          return {
            symbol: tradePairInfo.symbol,
            provider: TradingProviderEnum.BINANCE,
            marketType: MarketTypeEnum.SPOT,
            baseAsset: tradePairInfo.baseAsset,
            quoteAsset: tradePairInfo.quoteAsset,
            intervals: binanceSpotIntervals,
            pricePrecision: getPrecision(parseFloat(tradePairInfo.filters.find(f => f.filterType === 'PRICE_FILTER').tickSize)),
            baseAssetPrecision: getPrecision(parseFloat(tradePairInfo.filters.find(f => f.filterType === 'LOT_SIZE').stepSize)),
            quoteAssetPrecision: tradePairInfo.quoteAssetPrecision,
            makerCommissionPercent: commission?.makerCommissionPercent || 0,
            takerCommissionPercent: commission?.takerCommissionPercent || 0,
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
              ...(tradePairInfo.isMarginTradingAllowed && marginInfo && marginInfo.transferIn && marginInfo.borrowable
                ? {
                    margin: {
                      borrowLimit: parseFloat(marginInfo.borrowLimit),
                      hourlyInterestPercent: math(marginInfo.dailyInterest).mul(100).div(24).toNumber(),
                    },
                  }
                : {}),
            },
          };
        }),
    }));
}
