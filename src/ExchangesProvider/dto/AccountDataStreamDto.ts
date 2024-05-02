import { IStreamConnectToWsEvent, IStreamDelayPingWsEvent } from '../interfaces';
import { AccountDataStreamBalanceDto } from './AccountDataStreamBalanceDto';
import { AccountDataStreamOrderDto } from './AccountDataStreamOrderDto';

export type AccountDataStreamDto = AccountDataStreamBalanceDto | AccountDataStreamOrderDto | IStreamConnectToWsEvent | IStreamDelayPingWsEvent;
