import { Injectable } from '@nestjs/common';
import { CreateOrderRequestDto, CreateOrderResponseDto } from '../../ExchangesProvider';
import { CreateOrdersService } from './CreateOrdersService';

@Injectable()
export class CreateOrderService {
  constructor(protected readonly createOrdersService: CreateOrdersService) {}

  public call = ({ credentials, ...options }: CreateOrderRequestDto): Promise<CreateOrderResponseDto> => {
    return;
  };
}
