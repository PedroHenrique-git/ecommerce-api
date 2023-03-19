import { IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  clientId: number;

  @IsString()
  street: string;

  @IsString()
  neighborhood: string;

  @IsString()
  cep: string;
}
