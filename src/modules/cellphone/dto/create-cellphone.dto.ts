import { IsNumber, IsString } from 'class-validator';

export class CreateCellphoneDto {
  @IsNumber()
  clientId: number;

  @IsString()
  cellphone: string;
}
