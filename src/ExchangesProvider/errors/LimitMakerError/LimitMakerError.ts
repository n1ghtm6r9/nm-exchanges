import { BaseError } from '@nmxjs/errors';
import { ILimitMakerErrorOptions } from './interfaces';

export class LimitMakerError extends BaseError {
  public static readonly code = 'LIMIT_MAKER_ERROR';
  constructor({ provider, marketType }: ILimitMakerErrorOptions) {
    super(`Provider "${provider}", market type "${marketType}", order would immediately match and take!`);
  }
}
