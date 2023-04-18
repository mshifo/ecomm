import request from 'supertest';
import app from '../src/server';
import db from '../src/db';
import bcrypt from 'bcryptjs';


describe('Auth API Endpoints', () => {
    let authToken: string;

    describe('POST /api/auth/register', () => {
        afterAll(async () => {
            await db.query('DELETE FROM users WHERE email = $1', ['testuser@test.com']);
        });

        it('should create a new user and return 201 status', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@test.com',
                    password: 'password',
                    username: 'password',
                })
                .expect(200);
        });

        it('should return 400 status for existing email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@test.com',
                    password: 'password',
                    username: 'password',
                })
                .expect(400);
            expect(res.body.message).toBe('Email already in use');
        });

        it('should return 400 status for invalid input', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'testuser@test.com',
                    password: 'password',
                })
                .expect(400);
            expect(res.body.error).toBe("\"username\" is required");
        });

    });

    describe('POST /api/auth/login', () => {
        beforeAll(async () => {
            const hashedPassword = await bcrypt.hash('password', 10);
            await db.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
                ['Test User', 'testuser@test.com', hashedPassword]
            );
        });

        afterAll(async () => {
            await db.query('DELETE FROM users WHERE email = $1', ['testuser@test.com']);
        });

        it('should return an access token and 200 status for valid login', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@test.com',
                    password: 'password',
                })
                .expect(200);

            expect(res.body).toHaveProperty('token');
            authToken = res.body.access_token;
        });

        it('should return 401 status for invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrongemail@test.com',
                    password: 'password',
                })
                .expect(400);
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('should return 401 status for invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@test.com',
                    password: 'wrongpassword',
                })
                .expect(400);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });
});
