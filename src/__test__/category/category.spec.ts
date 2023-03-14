import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('Category', () => {
  let app: INestApplication;
  let createdCategoryId: number;
  const category = {
    name: `${new Date().toISOString()}-category`,
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

  it('POST /category should create a new category', () => {
    return request(app.getHttpServer())
      .post('/category')
      .send(category)
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();

        createdCategoryId = body.id;
      });
  });

  it('PATCH /category/:id should update a category', () => {
    return request(app.getHttpServer())
      .patch(`/category/${createdCategoryId}`)
      .send(category)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
      });
  });

  it('GET /category/find/:id should get a category by id', () => {
    return request(app.getHttpServer())
      .get(`/category/find/${createdCategoryId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
      });
  });

  it('GET /category/find/products/:id should get all category products', () => {
    return request(app.getHttpServer())
      .get(`/category/find/products/${createdCategoryId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.products).toBeDefined();
        expect(Array.isArray(body.products)).toBe(true);
      });
  });

  it('GET /category/find should get all categories with pagination', () => {
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

  it('PATCH /category/:id should return 400 error', () => {
    return request(app.getHttpServer())
      .patch(`/category/${createdCategoryId}`)
      .send({ test: 'test' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBeDefined();
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('DELETE /category/:id should delete a category by id', () => {
    return request(app.getHttpServer())
      .delete(`/category/${createdCategoryId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.name).toBeDefined();
      });
  });

  it('GET /category/find/:id should return 404 error', () => {
    return request(app.getHttpServer())
      .get(`/category/find/999`)
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBeDefined();
        expect(body.status).toBeDefined();
      });
  });

  it('PATCH /category/:id should return 500 error', () => {
    return request(app.getHttpServer())
      .patch(`/category/999`)
      .send(category)
      .expect(500)
      .expect(({ body }) => {
        expect(body.dbCode).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.meta).toBeDefined();
      });
  });

  it('DELETE /category/:id should return 500 error', () => {
    return request(app.getHttpServer())
      .delete(`/category/999`)
      .expect(500)
      .expect(({ body }) => {
        expect(body.dbCode).toBeDefined();
        expect(body.status).toBeDefined();
        expect(body.meta).toBeDefined();
      });
  });

  it('POST /category should return 400 error', () => {
    return request(app.getHttpServer())
      .post('/category')
      .send({ test: 'test' })
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBeDefined();
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });

  it('GET /category/find should return 400 error', () => {
    return request(app.getHttpServer())
      .get('/category/find?page=test&take=test')
      .expect(400)
      .expect(({ body }) => {
        expect(body.statusCode).toBeDefined();
        expect(body.message).toBeDefined();
        expect(body.error).toBeDefined();
      });
  });
});
