import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/prisma/prisma.client';
import bcrypt from 'bcryptjs';

describe('Purchase Resource', () => {
  let clientCookie: string[];
  let client2Cookie: string[];
  let adminCookie: string[];
  let productId: number;
  let purchaseId: number;

  beforeAll(async () => {
    // Setup Admin
    const adminEmail = `admin_purchase_${Date.now()}@example.com`;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let adminType = await prisma.userType.findFirst({ where: { name: 'admin' } });
    if (!adminType) adminType = await prisma.userType.create({ data: { name: 'admin' } });

    await prisma.user.create({
      data: { name: 'Admin Purchase', email: adminEmail, password: hashedPassword, userTypeId: adminType.id }
    });

    const resAdmin = await request(app).post('/api/users/login').send({ email: adminEmail, password });
    const cookiesAdmin = resAdmin.headers['set-cookie'];
    adminCookie = Array.isArray(cookiesAdmin) ? cookiesAdmin : [cookiesAdmin as unknown as string];

    // Setup Client 1
    const clientEmail = `client_purchase_${Date.now()}@example.com`;
    let clientType = await prisma.userType.findFirst({ where: { name: 'client' } });
    if (!clientType) clientType = await prisma.userType.create({ data: { name: 'client' } });

    await prisma.user.create({
      data: { name: 'Client Purchase', email: clientEmail, password: hashedPassword, userTypeId: clientType.id }
    });

    const resClient = await request(app).post('/api/users/login').send({ email: clientEmail, password });
    const cookiesClient = resClient.headers['set-cookie'];
    clientCookie = Array.isArray(cookiesClient) ? cookiesClient : [cookiesClient as unknown as string];

    // Setup Client 2 (para testar acesso indevido)
    const client2Email = `client2_purchase_${Date.now()}@example.com`;
    await prisma.user.create({
      data: { name: 'Client 2 Purchase', email: client2Email, password: hashedPassword, userTypeId: clientType.id }
    });
    const resClient2 = await request(app).post('/api/users/login').send({ email: client2Email, password });
    const cookiesClient2 = resClient2.headers['set-cookie'];
    client2Cookie = Array.isArray(cookiesClient2) ? cookiesClient2 : [cookiesClient2 as unknown as string];

    // Create Product
    const product = await prisma.product.create({
      data: {
        name: `Product Purchase Test ${Date.now()}`,
        description: 'Test Desc',
        price: 100.00,
        stock: 50
      }
    });
    productId = product.id;
  });

  it('should create a purchase', async () => {
    const res = await request(app)
      .post('/api/purchases')
      .set('Cookie', clientCookie)
      .send({
        items: [{ productId, quantity: 2 }]
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    purchaseId = res.body.data.id;
  });

  it('should list my purchases', async () => {
    const res = await request(app)
      .get('/api/purchases/my-purchases')
      .set('Cookie', clientCookie);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const purchase = res.body.data.find((p: any) => p.id === purchaseId);
    expect(purchase).toBeDefined();
  });

  it('should get purchase details', async () => {
    const res = await request(app)
      .get(`/api/purchases/${purchaseId}`)
      .set('Cookie', clientCookie);
    
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(purchaseId);
  });

  it('should update purchase status (Admin)', async () => {
    const res = await request(app)
      .patch(`/api/purchases/${purchaseId}/status`)
      .set('Cookie', adminCookie)
      .send({ status: 'PROCESSING' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('PROCESSING');
  });

  it('should cancel purchase', async () => {
    const res = await request(app)
      .patch(`/api/purchases/${purchaseId}/cancel`)
      .set('Cookie', clientCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('CANCELLED');
  });

  it('should get reports (Admin)', async () => {
    const res = await request(app)
      .get('/api/purchases/reports/summary')
      .set('Cookie', adminCookie);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalRevenue');
  });

  it('should fail to create purchase with insufficient stock', async () => {
    const res = await request(app)
      .post('/api/purchases')
      .set('Cookie', clientCookie)
      .send({
        items: [{ productId, quantity: 1000 }] // Estoque é 50
      });

    expect(res.status).toBe(400);
  });

  it('should fail to access purchase of another user', async () => {
    const res = await request(app)
      .get(`/api/purchases/${purchaseId}`)
      .set('Cookie', client2Cookie); // Client 2 tentando acessar compra do Client 1

    expect(res.status).toBe(403);
  });

  it('should fail to cancel purchase of another user', async () => {
    // Cria uma nova compra para o Client 1
    const purchaseRes = await request(app)
      .post('/api/purchases')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId, quantity: 1 }] });
    const newPurchaseId = purchaseRes.body.data.id;

    const res = await request(app)
      .patch(`/api/purchases/${newPurchaseId}/cancel`)
      .set('Cookie', client2Cookie); // Client 2 tentando cancelar

    expect(res.status).toBe(403);
  });

  it('should fail invalid status transition', async () => {
    // Cria uma nova compra
    const purchaseRes = await request(app)
      .post('/api/purchases')
      .set('Cookie', clientCookie)
      .send({ items: [{ productId, quantity: 1 }] });
    const newPurchaseId = purchaseRes.body.data.id;

    // Tenta pular de PENDING para DELIVERED direto
    const res = await request(app)
      .patch(`/api/purchases/${newPurchaseId}/status`)
      .set('Cookie', adminCookie)
      .send({ status: 'DELIVERED' });

    expect(res.status).toBe(400);
  });
});
