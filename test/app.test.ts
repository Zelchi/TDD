import supertest from 'supertest';
import App from '../src/app';

const request = supertest(App);

test('Deve responder na raiz', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
});