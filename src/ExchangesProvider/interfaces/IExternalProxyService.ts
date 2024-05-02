import { ProxyDto } from '@nmxjs/types';

export interface IExternalProxyService {
  getProxy(): Promise<ProxyDto>;
  removeProxy(proxy: ProxyDto): Promise<void>;
}
