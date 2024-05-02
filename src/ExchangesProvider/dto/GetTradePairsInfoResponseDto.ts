import { Field } from '@nmxjs/validation';
import { GetTradePairInfoResponseDto } from './GetTradePairInfoResponseDto';

export class GetTradePairsInfoResponseDto {
  @Field({
    type: GetTradePairInfoResponseDto,
    array: true,
  })
  data: GetTradePairInfoResponseDto[];
}
