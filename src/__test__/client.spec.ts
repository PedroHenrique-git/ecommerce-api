import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ClientModule } from 'src/modules/client/client.module';
import { ClientRepository } from 'src/modules/client/repository/client.repository';
import { InMemoryClientRepository } from 'src/modules/client/repository/in-memory/in-memory.client.repository';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import * as request from 'supertest';

describe('Client', () => {
  let app: INestApplication;

  const clientData = {
    name: `Test${new Date().toISOString()}`,
    address: 'street A',
    email: 'test@email.com',
    password: 'test123',
    cellphone: '12324245',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ClientModule],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(ClientRepository)
      .useClass(InMemoryClientRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /client should insert a new client', () => {
    return request(app.getHttpServer())
      .post('/client')
      .send({ ...clientData })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.address).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.password).toBeDefined();
        expect(body.cellphone).toBeDefined();
        expect(body.orders).toBeDefined();
      });
  });

  it('PATCH /client/:id should update new client', () => {
    return request(app.getHttpServer())
      .patch('/client/1')
      .send({ ...clientData })
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.address).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.password).toBeDefined();
        expect(body.cellphone).toBeDefined();
        expect(body.orders).toBeDefined();
      });
  });

  it('GET /client/find/:id should get a client by id', () => {
    return request(app.getHttpServer())
      .get('/client/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.address).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.password).toBeDefined();
        expect(body.cellphone).toBeDefined();
        expect(body.orders).toBeDefined();
      });
  });

  it('GET /client/find should get all client', () => {
    return request(app.getHttpServer())
      .get('/client/find')
      .expect(200)
      .expect(({ body }) => {
        expect(body.info.nextPageUrl).toBeDefined();
        expect(body.info.prevPageUrl).toBeDefined();
        expect(body.info.totalOfItems).toBeDefined();
        expect(body.info.totalOfPages).toBeDefined();
        expect(body.results).toBeDefined();
        expect(Array.isArray(body.results)).toBe(true);
      });
  });

  it('DELETE /client/:id should delete a client', () => {
    return request(app.getHttpServer())
      .delete('/client/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.address).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.password).toBeDefined();
        expect(body.cellphone).toBeDefined();
        expect(body.orders).toBeDefined();
      });
  });

  it('GET /client/find/:id should return a not found message', () => {
    return request(app.getHttpServer())
      .get('/client/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('DELETE /client/:id should return a error object', () => {
    return request(app.getHttpServer())
      .delete('/client/1')
      .send({ ...clientData })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('PATCH /client/:id should return a error object', () => {
    return request(app.getHttpServer())
      .patch('/client/1')
      .send({ status: 'delivery' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
