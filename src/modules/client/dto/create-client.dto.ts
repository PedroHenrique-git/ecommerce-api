import { IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsOptional()
  providerId?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
