import { IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  cellphone: string;
}
