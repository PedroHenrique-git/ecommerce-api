import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  @IsOptional()
  clientId: number;

  @IsString()
  @IsOptional()
  status: string;
}
