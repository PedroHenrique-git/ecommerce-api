import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { OrderItemsModule } from 'src/modules/order-items/order-items.module';
import { InMemoryOrderItemsRepository } from 'src/modules/order-items/repository/in-memory/in-memory.order-items.repository';
import { OrderItemsRepository } from 'src/modules/order-items/repository/order-items.repository';
import * as request from 'supertest';

describe('OrderItems', () => {
  let app: INestApplication;
  const orderId = 1;
  const orderItemId = 1;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [OrderItemsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(OrderItemsRepository)
      .useClass(InMemoryOrderItemsRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /order-items should insert a new order items', () => {
    return request(app.getHttpServer())
      .post('/order-items')
      .send({ orderId, orderItemId })
      .expect(201)
      .expect(({ body }) => {
        expect(body.orderId).toBeDefined();
        expect(body.orderItemId).toBeDefined();
        expect(body.order).toBeDefined();
        expect(body.orderItem).toBeDefined();
      });
  });

  it('PATCH /order-items/:orderId/:orderItemId should update new order items', () => {
    return request(app.getHttpServer())
      .patch(`/order-items/${orderId}/${orderItemId}`)
      .send({ orderId, orderItemId })
      .expect(200)
      .expect(({ body }) => {
        expect(body.orderId).toBeDefined();
        expect(body.orderItemId).toBeDefined();
        expect(body.order).toBeDefined();
        expect(body.orderItem).toBeDefined();
      });
  });

  it('GET /order-items/find/:orderId/:orderItemId should get a order items by id', () => {
    return request(app.getHttpServer())
      .get(`/order-items/find/${orderId}/${orderItemId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.orderId).toBeDefined();
        expect(body.orderItemId).toBeDefined();
        expect(body.order).toBeDefined();
        expect(body.orderItem).toBeDefined();
      });
  });

  it('GET /order-items/find should get all order items', () => {
    return request(app.getHttpServer())
      .get('/order-items/find')
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

  it('DELETE /order-items/:orderId/:orderItemId should delete a order items', () => {
    return request(app.getHttpServer())
      .delete(`/order-items/${orderId}/${orderItemId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.orderId).toBeDefined();
        expect(body.orderItemId).toBeDefined();
        expect(body.order).toBeDefined();
        expect(body.orderItem).toBeDefined();
      });
  });

  it('GET /order-items/find/:orderId/:orderItemId should return a not found message', () => {
    return request(app.getHttpServer())
      .get(`/order-items/find/${orderId}/${orderItemId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('DELETE /order-items/:orderId/:orderItemId should return a error object', () => {
    return request(app.getHttpServer())
      .delete(`/order-items/${orderId}/${orderItemId}`)
      .send({ orderId, orderItemId })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('PATCH /order-items/:orderId/:orderItemId should return a error object', () => {
    return request(app.getHttpServer())
      .patch(`/order-items/${orderId}/${orderItemId}`)
      .send({ orderId, orderItemId })
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
