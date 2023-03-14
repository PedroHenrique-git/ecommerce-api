import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateAddressDto } from 'src/modules/address/dto/create-address.dto';
import { CreateClientDto } from 'src/modules/client/dto/create-client.dto';
import * as request from 'supertest';

describe('Address', () => {
  let app: INestApplication;
  let createdAddressId: number;

  const clientData: CreateClientDto = {
    name: 'test',
    email: `test${Math.random() * 1000}@email.com`,
    password: 'testAbc@asdas$12',
    provider: '',
    providerId: '',
  };

  const addressData: CreateAddressDto = {
    cep: `######-##`,
    clientId: 0,
    neighborhood: 'test',
    street: 'test',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /address should create a new address', async () => {
    const client = await request(app.getHttpServer())
      .post('/client')
      .send(clientData);

    addressData.clientId = client.body.id;

    return request(app.getHttpServer())
      .post('/address')
      .send(addressData)
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.cep).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.neighborhood).toBeDefined();
        expect(body.street).toBeDefined();

        createdAddressId = body.id;
      });
  });

  it('PATCH /address/:id should update a address', () => {
    return request(app.getHttpServer())
      .patch(`/address/${createdAddressId}`)
      .send(addressData)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.cep).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.neighborhood).toBeDefined();
        expect(body.street).toBeDefined();
      });
  });

  it('GET /address/find/:id should get a address by id', () => {
    return request(app.getHttpServer())
      .get(`/address/find/${createdAddressId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.cep).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.neighborhood).toBeDefined();
        expect(body.street).toBeDefined();
      });
  });

  it('GET /address/find should get all addresses with pagination', () => {
    return request(app.getHttpServer())
      .get('/address/find')
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

  it('PATCH /address/:id should return 400 error', () => {
    return request(app.getHttpServer())
      .patch(`/address/${createdAddressId}`)
      .send({ neighborhood: 800 })
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBeDefined();
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('DELETE /address/:id should delete a address by id', () => {
    request(app.getHttpServer())
      .delete(`/address/${createdAddressId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.cep).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.neighborhood).toBeDefined();
        expect(body.street).toBeDefined();
      });

    request(app.getHttpServer()).delete(`/client/${addressData.clientId}`);
  });

  it('GET /address/find/:id should return 404 error', () => {
    return request(app.getHttpServer())
      .get(`/address/find/999`)
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.status).toBeDefined();
      });
  });

  it('PATCH /address/:id should return 500 error', () => {
    return request(app.getHttpServer())
      .patch(`/address/999`)
      .send(addressData)
      .expect(500)
      .expect(({ body }) => {
        expect(body.dbCode).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.meta).toBeDefined();
      });
  });

  it('DELETE /address/:id should return 500 error', () => {
    return request(app.getHttpServer())
      .delete(`/address/999`)
      .expect(500)
      .expect(({ body }) => {
        expect(body.dbCode).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.meta).toBeDefined();
      });
  });

  it('POST /address should return 400 error', () => {
    return request(app.getHttpServer())
      .post('/address')
      .send({ test: 'test' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBeDefined();
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('GET /address/find should return 400 error', () => {
    return request(app.getHttpServer())
      .get('/address/find?page=test&take=test')
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBeDefined();
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });
});
