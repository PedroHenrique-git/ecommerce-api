import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemsDto {
  @IsNumber()
  @IsOptional()
  orderId: number;

  @IsNumber()
  @IsOptional()
  orderItemId: number;
}
