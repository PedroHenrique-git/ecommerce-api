import { IsNumber, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsNumber()
  clientId: number;

  @IsString()
  token: string;
}
