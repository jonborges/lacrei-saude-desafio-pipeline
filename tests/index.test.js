const request = require('supertest');
const server = require('../src/index'); 


afterAll((done) => {
  server.close(done);
});

describe('Testes das Rotas da API', () => {
  it('GET / deve retornar status 200 e uma mensagem de boas-vindas', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('API Desafio Lacrei Saúde');
  });

  it('GET /status deve retornar status 200 e um JSON com o status da API', async () => {
    const res = await request(server).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
  });
});