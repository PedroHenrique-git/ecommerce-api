import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './repository/client.repository';

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  create(client: CreateClientDto) {
    return this.clientRepository.create(client);
  }

  findById(id: number) {
    return this.clientRepository.findById(id);
  }

  findByEmail(email: string) {
    return this.clientRepository.findByEmail(email);
  }

  update(id: number, client: UpdateClientDto) {
    return this.clientRepository.update(id, client);
  }

  delete(id: number) {
    return this.clientRepository.delete(id);
  }

  find(page: number, take: number) {
    return this.clientRepository.find(page, take);
  }
}
