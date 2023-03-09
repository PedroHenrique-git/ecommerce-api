import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  clientId: number;

  @IsString()
  status: string;
}
