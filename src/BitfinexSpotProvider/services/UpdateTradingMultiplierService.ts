import { Injectable } from '@nestjs/common';
import { UpdateTradingMultiplierRequestDto, UpdateTradingMultiplierResponseDto } from '../../ExchangesProvider';

@Injectable()
export class UpdateTradingMultiplierService {
  public call(options: UpdateTradingMultiplierRequestDto): Promise<UpdateTradingMultiplierResponseDto> {
    throw new Error('Method unsupported!');
  }
}
