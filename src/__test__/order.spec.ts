import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { OrderModule } from 'src/modules/order/order.module';
import { InMemoryOrderRepository } from 'src/modules/order/repository/in-memory/in-memory.order.repository';
import { OrderRepository } from 'src/modules/order/repository/order.repository';
import * as request from 'supertest';

describe('Order', () => {
  let app: INestApplication;
  const clientId = 1;
  const status = 'pending';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [OrderModule],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(OrderRepository)
      .useClass(InMemoryOrderRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /order should insert a new order', () => {
    return request(app.getHttpServer())
      .post('/order')
      .send({ clientId, status })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.client).toBeDefined();
        expect(body.ordersItems).toEqual([]);
      });
  });

  it('PATCH /order/:id should update new order', () => {
    return request(app.getHttpServer())
      .patch('/order/1')
      .send({ status: 'shipping' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.client).toBeDefined();
        expect(body.ordersItems).toEqual([]);
      });
  });

  it('GET /order/find/:id should get a order by id', () => {
    return request(app.getHttpServer())
      .get('/order/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.client).toBeDefined();
        expect(body.ordersItems).toEqual([]);
      });
  });

  it('GET /order/find should get all orders', () => {
    return request(app.getHttpServer())
      .get('/order/find')
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

  it('DELETE /order/:id should delete a order', () => {
    return request(app.getHttpServer())
      .delete('/order/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.clientId).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.client).toBeDefined();
        expect(body.ordersItems).toEqual([]);
      });
  });

  it('GET /order/find/:id should return a not found message', () => {
    return request(app.getHttpServer())
      .get('/order/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('DELETE /order/:id should return a error object', () => {
    return request(app.getHttpServer())
      .delete('/order/1')
      .send({ status: 'shipping' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('PATCH /order/:id should return a error object', () => {
    return request(app.getHttpServer())
      .patch('/order/1')
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
