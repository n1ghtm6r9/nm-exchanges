import * as objectHash from 'object-hash';
import { Inject, Injectable } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import {
  MarketDataStreamRequestDto,
  MarketDataStreamRequestDataOrderBookMethodDto,
  MarketDataStreamDto,
  BaseStreamService,
  MarketDataStreamOrderBookDto,
} from '../../ExchangesProvider';

@Injectable()
export class MarketDataStreamService extends BaseStreamService<MarketDataStreamRequestDto, MarketDataStreamDto> {
  protected connectionOptions: Record<string, MarketDataStreamRequestDataOrderBookMethodDto>[] = [];

  constructor(@Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory) {
    super(webSocketFactory);
  }

  protected getKey = (options: MarketDataStreamRequestDto) => objectHash(options);

  protected getWsOptions = ({ methods }: MarketDataStreamRequestDto) => {
    return {} as any;
  };

  protected onData(data): MarketDataStreamOrderBookDto[] {
    const result: MarketDataStreamOrderBookDto[] = [];

    return result;
  }
}
