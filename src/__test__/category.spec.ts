import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryRepository } from 'src/modules/category/repository/category.repository';
import { InMemoryCategoryRepository } from 'src/modules/category/repository/in-memory/in-memory.category.repository';
import { PrismaService } from 'src/modules/common/database/prisma.service';
import * as request from 'supertest';

describe('Category', () => {
  let app: INestApplication;
  const categoryName = `Test${new Date().toISOString()}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CategoryModule],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(CategoryRepository)
      .useClass(InMemoryCategoryRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /category should insert a new category', () => {
    return request(app.getHttpServer())
      .post('/category')
      .send({ name: categoryName })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.name).toBe(categoryName);
        expect(body.products).toBeDefined();
        expect(body.products).toEqual([]);
      });
  });

  it('PATCH /category/:id should update new category', () => {
    return request(app.getHttpServer())
      .patch('/category/1')
      .send({ name: categoryName })
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.name).toBe(categoryName);
        expect(body.products).toBeDefined();
        expect(body.products).toEqual([]);
      });
  });

  it('GET /category/find/:id should get a category by id', () => {
    return request(app.getHttpServer())
      .get('/category/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.products).toBeDefined();
      });
  });

  it('GET /category/find should get all categories', () => {
    return request(app.getHttpServer())
      .get('/category/find')
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

  it('DELETE /category/:id should delete a category', () => {
    return request(app.getHttpServer())
      .delete('/category/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
        expect(body.name).toBe(categoryName);
        expect(body.products).toBeDefined();
        expect(body.products).toEqual([]);
      });
  });

  it('GET /category/find/:id should return a not found message', () => {
    return request(app.getHttpServer())
      .get('/category/find/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
      });
  });

  it('DELETE /category/:id should return a error object', () => {
    return request(app.getHttpServer())
      .delete('/category/1')
      .send({ name: categoryName })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('PATCH /category/:id should return a error object', () => {
    return request(app.getHttpServer())
      .patch('/category/1')
      .send({ name: categoryName })
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
