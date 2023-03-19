import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsNumber()
  @IsOptional()
  clientId: number;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  neighborhood: string;

  @IsString()
  @IsOptional()
  cep: string;
}
