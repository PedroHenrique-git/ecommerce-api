import { IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  role?: string;
}
