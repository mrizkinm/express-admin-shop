import request from 'supertest';
import app from '../src/app'; // Express app
import jwt from 'jsonwebtoken';
import { UserTest } from './test.utils';

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: 'test@example.com',
      password: '123456',
    });
    
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET as string);

    // console.log('Response Body:', res.body);
    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      token: expect.any(String),  // 🔑 token bisa string apapun
      id: expect.any(Number),     // id yang penting number
      name: 'Test',
      email: 'test@example.com',
    });

    expect(decoded).toMatchObject({
      id: expect.any(Number),
      name: 'Test',
      email: 'test@example.com'
    });
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.errors).toBe('Username or password is wrong');
  });
});