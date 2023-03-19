import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  role?: string;
}
