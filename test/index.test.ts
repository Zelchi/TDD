import { expect, test } from '@jest/globals';
import supertest from 'supertest';


const request = supertest('http://localhost:8080');

test('Deve responder com 200', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
});