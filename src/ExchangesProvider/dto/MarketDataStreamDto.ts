import { IStreamConnectToWsEvent, IStreamDelayPingWsEvent } from '../interfaces';
import { MarketDataStreamOrderBookDto } from './MarketDataStreamOrderBookDto';
import { MarketDataStreamAggregateTradeDto } from './MarketDataStreamAggregateTradeDto';

export type MarketDataStreamDto =
  | MarketDataStreamOrderBookDto
  | MarketDataStreamAggregateTradeDto
  | IStreamConnectToWsEvent
  | IStreamDelayPingWsEvent;
