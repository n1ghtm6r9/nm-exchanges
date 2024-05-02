import { TradePairTimeIntervalEnum } from '../../ExchangesProvider';

export const kucoinSpotIntervals = [
  { value: 1, type: TradePairTimeIntervalEnum.m },
  { value: 3, type: TradePairTimeIntervalEnum.m },
  { value: 15, type: TradePairTimeIntervalEnum.m },
  { value: 30, type: TradePairTimeIntervalEnum.m },
  { value: 1, type: TradePairTimeIntervalEnum.h },
  { value: 2, type: TradePairTimeIntervalEnum.h },
  { value: 4, type: TradePairTimeIntervalEnum.h },
  { value: 6, type: TradePairTimeIntervalEnum.h },
  { value: 8, type: TradePairTimeIntervalEnum.h },
  { value: 12, type: TradePairTimeIntervalEnum.h },
  { value: 1, type: TradePairTimeIntervalEnum.d },
  { value: 1, type: TradePairTimeIntervalEnum.w },
];
