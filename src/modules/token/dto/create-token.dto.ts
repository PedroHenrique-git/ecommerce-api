import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsNumber()
  @IsOptional()
  clientId?: number;

  @IsNumber()
  @IsOptional()
  adminId?: number;

  @IsString()
  token: string;
}
