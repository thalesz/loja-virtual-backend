import request from 'supertest';
import app from '../../src/app';

describe('Language Resource', () => {
  it('should set default language cookie on first request', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    // Verifica se o cookie 'lang' foi definido
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
    const langCookie = cookiesArray.find((c: string) => c.startsWith('lang='));
    expect(langCookie).toBeDefined();
    expect(langCookie).toContain('pt-BR');
  });

  it('should change language cookie via endpoint', async () => {
    const res = await request(app).get('/language/change?lang=en-US');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Idioma alterado para en-US');
    
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const cookiesArray = Array.isArray(cookies) ? cookies : [cookies];
    const langCookie = cookiesArray.find((c: string) => c.includes('lang=en-US'));
    expect(langCookie).toBeDefined();
  });

  it('should return 400 if lang is missing', async () => {
    const res = await request(app).get('/language/change');
    expect(res.status).toBe(400);
  });
});
