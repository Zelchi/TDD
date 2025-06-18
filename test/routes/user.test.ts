import supertest from 'supertest';
import App from '../../src/app';

const request = supertest(App);

test('Não deve inserir usuário sem nome, email ou senha', async () => {
    const res = await request.post('/users/reg').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome, email e senha são obrigatórios');
});

test('Não deve inserir usuário com email inválido', async () => {
    const res = await request.post('/users/reg').send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Formato de email inválido');
});

test('Não deve inserir usuário com senha fraca', async () => {
    const res = await request.post('/users/reg').send({
        name: 'Test User',
        email: Date.now() + '@example.com',
        password: 'weak'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Senha muito fraca');
});

test('Não deve inserir usuário com nome vazio', async () => {
    const res = await request.post('/users/reg').send({
        name: '',
        email: Date.now() + '@example.com',
        password: 'StrongPassword123!'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome, email e senha são obrigatórios');
});

test('Não deve inserir usuário com email vazio', async () => {
    const res = await request.post('/users/reg').send({
        name: 'Test User',
        email: '',
        password: 'StrongPassword123!'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome, email e senha são obrigatórios');
});

test('Não deve inserir usuário com senha vazia', async () => {
    const res = await request.post('/users/reg').send({
        name: 'Test User',
        email: Date.now() + '@example.com',
        password: ''
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome, email e senha são obrigatórios');
});