import { TradePairIntervalDto, TradePairTimeIntervalEnum } from '../../../ExchangesProvider';

export function convertInterval(interval: TradePairIntervalDto): string {
  const map = {
    [TradePairTimeIntervalEnum.m]: 'Min',
    [TradePairTimeIntervalEnum.h]: 'Hour',
    [TradePairTimeIntervalEnum.d]: 'Day',
    [TradePairTimeIntervalEnum.w]: 'Week',
    [TradePairTimeIntervalEnum.M]: 'Month',
  };

  if (!map[interval.type]) {
    throw new Error(`Mexc unsupported interval ${interval.type}${interval.value}!`);
  }

  return `${map[interval.type]}${interval.value}`;
}
