import request from 'supertest';
import app from '../../src/app';

describe('Auth Resource', () => {
  const uniqueEmail = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
  const password = 'password123';

  it('should register a new client', async () => {
    const res = await request(app)
      .post('/api/users/register-client')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: password
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Test User');
    expect(res.body).toHaveProperty('email', uniqueEmail);
  });

  it('should login with registered user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: uniqueEmail,
        password: password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login realizado com sucesso.');
    expect(res.body.user).toHaveProperty('email', uniqueEmail);
    
    // Verifica cookie de sessão
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
    const sessionCookie = cookiesArray.find((c: string) => c.startsWith('connect.sid'));
    expect(sessionCookie).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: uniqueEmail,
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
  });
});
