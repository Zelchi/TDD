import supertest from 'supertest';
import App from '../src/app';

const request = supertest(App);

test('Deve listar todos os usuários', async () => {
    const res = await request.get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('email');
})

test('Deve inserir um novo usuário', async () => {
    const res = await request.post('/users').send(
        { name: 'Walter Batata', mail: 'walter@mail.com' }
    );
    expect(res.statusCode).toBe(201);
})