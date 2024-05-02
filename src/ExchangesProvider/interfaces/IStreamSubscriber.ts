import { IStreamSubscriberListener } from './IStreamSubscriberListener';

export interface IStreamSubscriber {
  id: string;
  listeners: IStreamSubscriberListener[];
}
