import supertest from 'supertest';
import App from '../src/app';

const request = supertest(App);

test('Deve listar todos os usuários', async () => {
    const res = await request.get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name', 'John Doe');
})