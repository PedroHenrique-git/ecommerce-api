import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDto {
  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsNumber()
  @IsOptional()
  productId: number;
}
