import { Injectable } from '@nestjs/common';
import { PaginationService } from 'src/modules/common/pagination/pagination.service';
import { Pagination } from 'src/shared/interfaces/pagination.interface';
import { CreateClientDto } from '../../dto/create-client.dto';
import { UpdateClientDto } from '../../dto/update-client.dto';
import { Client } from '../../protocols/client.interface';
import { ClientRepository } from '../client.repository';

@Injectable()
export class InMemoryClientRepository extends ClientRepository {
  constructor(private paginationService: PaginationService) {
    super();
  }

  private clients: Client[] = [];

  private getNextId() {
    const lastIndex = this.clients.length;

    return lastIndex === 0 ? 1 : lastIndex + 1;
  }

  create(client: CreateClientDto): Promise<Client> {
    const length = this.clients.push({
      id: this.getNextId(),
      orders: [],
      provider: '',
      providerId: '',
      ...client,
    });

    return Promise.resolve(this.clients[length - 1]);
  }

  delete(id: number): Promise<Client> {
    const index = this.clients.findIndex((c) => c.id === id);
    const client = this.clients[index];

    this.clients = this.clients.filter((c) => c.id !== id);

    if (!client) {
      throw new Error('Record not found');
    }

    return Promise.resolve(client);
  }

  findById(id: number): Promise<Client> {
    return Promise.resolve(this.clients.find((c) => c.id === id));
  }

  findByEmail(email: string): Promise<Client> {
    return Promise.resolve(this.clients.find((c) => c.email === email));
  }

  update(id: number, client: UpdateClientDto): Promise<Client> {
    let index = -1;

    const newClients = this.clients.map((c, i) => {
      if (c.id === id) {
        index = i;

        return {
          ...c,
          ...client,
        };
      }

      return c;
    });

    if (index === -1) {
      throw new Error('Record not found');
    }

    return Promise.resolve(newClients[index]);
  }

  find(page: number, take: number): Promise<Pagination<Client[]>> {
    const totalOfItems = this.clients.length;

    const { nextSkip, nextPageUrl, prevPageUrl, totalOfPages } =
      this.paginationService.getPagination({
        page,
        take,
        totalOfItems,
        route: '/client/find',
      });

    const results = this.clients.slice(nextSkip, page * take);

    return Promise.resolve({
      info: {
        nextPageUrl,
        prevPageUrl,
        totalOfItems,
        totalOfPages,
      },
      results,
    });
  }
}
