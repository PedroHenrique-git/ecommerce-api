import { IsNumber } from 'class-validator';

export class CreateOrderItemsDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  orderItemId: number;
}
