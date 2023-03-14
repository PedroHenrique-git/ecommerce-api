import { IsNumber, IsString } from 'class-validator';

export class UpdateTokenDto {
  @IsNumber()
  clientId: number;

  @IsString()
  token: string;
}
