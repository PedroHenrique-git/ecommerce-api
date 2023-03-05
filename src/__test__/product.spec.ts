import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { resolve } from 'path';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import { ProductModule } from 'src/modules/product/product.module';
import { InMemoryProductRepository } from 'src/modules/product/repository/in-memory/in-memory.product.repository';
import { ProductRepository } from 'src/modules/product/repository/product.repository';
import * as request from 'supertest';

describe('Product', () => {
  let app: INestApplication;

  const fileUrlPath = resolve(
    __dirname,
    '..',
    '..',
    'public',
    'images',
    'products',
    'test.jpg',
  );

  const productName = `Test${new Date().toISOString()}`;
  const productPrice = Math.random() * 100;
  const categoryId = 1;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(ProductRepository)
      .useClass(InMemoryProductRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /product should insert a new product', () => {
    return request(app.getHttpServer())
      .post('/product')
      .field('price', productPrice)
      .field('name', productName)
      .field('categoryId', categoryId)
      .attach('file', fileUrlPath)
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.categoryId).toBeDefined();
        expect(body.price).toBeDefined();
        expect(body.image).toBeDefined();
        expect(body.category).toBeDefined();
      });
  });

  it('PATCH /product/:id should update new product', () => {
    return request(app.getHttpServer())
      .patch('/product/1')
      .field('price', productPrice)
      .field('name', productName)
      .field('categoryId', categoryId)
      .attach('file', fileUrlPath)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.categoryId).toBeDefined();
        expect(body.price).toBeDefined();
        expect(body.image).toBeDefined();
        expect(body.category).toBeDefined();
      });
  });

  it('GET /product/find/:id should get a product by id', () => {
    return request(app.getHttpServer())
      .get('/product/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.categoryId).toBeDefined();
        expect(body.price).toBeDefined();
        expect(body.image).toBeDefined();
        expect(body.category).toBeDefined();
      });
  });

  it('GET /product/find should get all products', () => {
    return request(app.getHttpServer())
      .get('/product/find')
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

  it('DELETE /product/:id should delete a product', () => {
    return request(app.getHttpServer())
      .delete('/product/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.categoryId).toBeDefined();
        expect(body.price).toBeDefined();
        expect(body.image).toBeDefined();
        expect(body.category).toBeDefined();
      });
  });

  it('GET /product/find/:id should return a not found message', () => {
    return request(app.getHttpServer())
      .get('/product/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('DELETE /product/:id should return a error object', () => {
    return request(app.getHttpServer())
      .delete('/product/1')
      .send({ name: productName })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('PATCH /product/:id should return a error object', () => {
    return request(app.getHttpServer())
      .patch('/product/1')
      .send({ name: productName })
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
