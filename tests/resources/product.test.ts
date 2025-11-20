import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/prisma/prisma.client';
import bcrypt from 'bcryptjs';

describe('Product Resource', () => {
  let adminCookie: string[];
  let clientCookie: string[];

  beforeAll(async () => {
    // Cria um admin para os testes
    const email = `admin_test_${Date.now()}@example.com`;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    let adminType = await prisma.userType.findFirst({ where: { name: 'admin' } });
    if (!adminType) {
        adminType = await prisma.userType.create({ data: { name: 'admin' } });
    }

    await prisma.user.create({
      data: {
        name: 'Admin Test',
        email,
        password: hashedPassword,
        userTypeId: adminType.id
      }
    });

    // Login Admin
    const res = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    
    const cookies = res.headers['set-cookie'];
    adminCookie = Array.isArray(cookies) ? cookies : [cookies as unknown as string];

    // Cria um cliente para testes de permissão
    const clientEmail = `client_product_test_${Date.now()}@example.com`;
    let clientType = await prisma.userType.findFirst({ where: { name: 'client' } });
    if (!clientType) {
        clientType = await prisma.userType.create({ data: { name: 'client' } });
    }

    await prisma.user.create({
      data: {
        name: 'Client Test',
        email: clientEmail,
        password: hashedPassword,
        userTypeId: clientType.id
      }
    });

    // Login Client
    const resClient = await request(app)
      .post('/api/users/login')
      .send({ email: clientEmail, password });
    
    const cookiesClient = resClient.headers['set-cookie'];
    clientCookie = Array.isArray(cookiesClient) ? cookiesClient : [cookiesClient as unknown as string];
  });

  it('should create a product (Admin)', async () => {
    const res = await request(app)
      .post('/api/products/create')
      .set('Cookie', adminCookie)
      .send({
        name: `Product Test ${Date.now()}`,
        description: 'Description test',
        price: 100.50,
        stock: 10
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
  });

  it('should list products (Public)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fail to create product as Client', async () => {
    const res = await request(app)
      .post('/api/products/create')
      .set('Cookie', clientCookie)
      .send({
        name: `Product Fail ${Date.now()}`,
        description: 'Description test',
        price: 100.50,
        stock: 10
      });

    expect(res.status).toBe(403);
  });

  it('should fail to create product without authentication', async () => {
    const res = await request(app)
      .post('/api/products/create')
      .send({
        name: `Product Fail Auth ${Date.now()}`,
        description: 'Description test',
        price: 100.50,
        stock: 10
      });

    expect(res.status).toBe(401);
  });

  it('should fail to create product with invalid data (negative price)', async () => {
    const res = await request(app)
      .post('/api/products/create')
      .set('Cookie', adminCookie)
      .send({
        name: `Product Invalid ${Date.now()}`,
        description: 'Description test',
        price: -10,
        stock: 10
      });

    expect(res.status).toBe(400);
  });
});
