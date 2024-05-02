import { Field } from '@nmxjs/validation';
import { FundingDataDto } from './FundingDataDto';

export class GetFundingDataResponseDto {
  @Field({
    type: FundingDataDto,
    array: true,
  })
  fundingData: FundingDataDto[];
}
