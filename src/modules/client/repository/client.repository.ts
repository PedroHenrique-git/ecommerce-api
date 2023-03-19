import { Client } from '@prisma/client';
import { Pagination } from 'src/shared/protocols/pagination.interface';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { ClientOrders } from '../protocols/client-orders.type';

export abstract class ClientRepository {
  abstract create(client: CreateClientDto): Promise<Client>;
  abstract findById(id: number): Promise<Client>;
  abstract findByEmail(email: string): Promise<Client>;
  abstract find(page: number, take: number): Promise<Pagination<Client[]>>;
  abstract update(id: number, client: UpdateClientDto): Promise<Client>;
  abstract delete(id: number): Promise<Client>;
  abstract findClientOrdersById(id: number): Promise<ClientOrders>;
}
