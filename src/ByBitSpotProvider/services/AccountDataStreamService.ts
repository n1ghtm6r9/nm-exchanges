import { Inject, Injectable } from '@nestjs/common';
import { webSocketFactoryKey, type IWebSocketFactory } from '@nmxjs/ws';
import { AccountDataStreamRequestDto, AccountDataStreamDto, BaseStreamService } from '../../ExchangesProvider';
import type { IBybitSpotHttpProvider } from '../interfaces';
import { bybitSpotHttpProviderKey } from '../constants';

@Injectable()
export class AccountDataStreamService extends BaseStreamService<AccountDataStreamRequestDto, AccountDataStreamDto> {
  constructor(
    @Inject(bybitSpotHttpProviderKey) protected readonly http: IBybitSpotHttpProvider,
    @Inject(webSocketFactoryKey) protected readonly webSocketFactory: IWebSocketFactory
  ) {
    super(webSocketFactory);
  }

  protected getKey = (options: AccountDataStreamRequestDto) => `${options.credentials.publicKey}${options.credentials.secretKey}`;

  protected getWsOptions = (options: AccountDataStreamRequestDto) => [];

  protected onData(data) {
    const result: AccountDataStreamDto[] = [];

    return result;
  }
}
