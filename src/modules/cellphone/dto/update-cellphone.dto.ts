import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCellphoneDto {
  @IsNumber()
  @IsOptional()
  clientId: number;

  @IsString()
  @IsOptional()
  cellphone: string;
}
