import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { Client } from '../protocols/client.interface';

export abstract class ClientRepository {
  abstract create(client: CreateClientDto): Promise<Client>;
  abstract findById(id: number): Promise<Client>;
  abstract findByEmail(email: string): Promise<Client>;
  abstract find(page: number, take: number): Promise<Pagination<Client[]>>;
  abstract update(id: number, client: UpdateClientDto): Promise<Client>;
  abstract delete(id: number): Promise<Client>;
}
