import * as objectHash from 'object-hash';
import { Inject, Injectable } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import {
  BaseStreamService,
  MarketDataStreamRequestDto,
  MarketDataStreamRequestMethodDto,
  IOnDataOptions,
  MarketDataStreamDto,
} from '../../ExchangesProvider';
import type { IBitfinexSpotHttpProvider } from '../interfaces';
import { bitfinexSpotHttpProviderKey } from '../constants';

@Injectable()
export class MarketDataStreamService extends BaseStreamService<MarketDataStreamRequestDto, MarketDataStreamDto> {
  protected connectionOptions: Record<string, MarketDataStreamRequestMethodDto>[] = [];

  constructor(
    @Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory,
    @Inject(bitfinexSpotHttpProviderKey) protected readonly http: IBitfinexSpotHttpProvider
  ) {
    super(webSocketFactory);
  }

  protected getKey = (options: MarketDataStreamRequestDto) => objectHash(options);

  protected getWsOptions = ({ methods }: MarketDataStreamRequestDto) => [];

  protected onData({ data, meta, client }: IOnDataOptions<string[]>): MarketDataStreamDto[] {
    const result: MarketDataStreamDto[] = [];

    return result;
  }
}
