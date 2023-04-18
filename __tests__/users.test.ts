import request from 'supertest';
import app from '../src/server';
import db from '../src/db';

describe('User Management API', () => {
    // Test POST /admin/users route
    describe('POST /admin/users', () => {
        beforeEach(async () => {
            // Truncate users table before each test
            await db.query('TRUNCATE TABLE users');
        });

        test('should create a new user', async () => {
            // Make a POST request with a new user
            const response = await request(app)
                .post('/admin/users')
                .send({ name: 'John Doe', email: 'johndoe@example.com' });

            // Check that the response has a 201 status code
            expect(response.status).toBe(201);

            // Check that the response body contains the new user's ID
            expect(response.body.id).toBeDefined();
            expect(typeof response.body.id).toBe('number');

            // Check that the new user exists in the database
            const result = await db.query('SELECT * FROM users WHERE id = $1', [response.body.id]);
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('John Doe');
            expect(result[0].email).toBe('johndoe@example.com');
        });

        test('should return a 400 error if name and email are not present', async () => {
            // Make a POST request with missing fields
            const response = await request(app).post('/admin/users').send({});

            // Check that the response has a 400 status code
            expect(response.status).toBe(400);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('Name and email are required');
        });

        test('should return a 400 error if email is not valid', async () => {
            // Make a POST request with an invalid email
            const response = await request(app)
                .post('/admin/users')
                .send({ name: 'John Doe', email: 'invalid-email' });

            // Check that the response has a 400 status code
            expect(response.status).toBe(400);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('Invalid email format');
        });

        test('should return a 400 error if email already exists', async () => {
            // Insert a user with a duplicate email into the database
            await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['Jane Doe', 'janedoe@example.com']);

            // Make a POST request with a user that has the same email as the existing user
            const response = await request(app)
                .post('/admin/users')
                .send({ name: 'John Doe', email: 'janedoe@example.com' });

            // Check that the response has a 400 status code
            expect(response.status).toBe(400);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('Email already exists');
        });
    });

    // Test PUT /admin/users/:id route
    describe('PUT /admin/users/:id', () => {
        beforeEach(async () => {
            //
            // Truncate users table before each test
            await db.query('TRUNCATE TABLE users');

            // Insert a user into the database
            await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['John Doe', 'johndoe@example.com']);
        });

        test('should update an existing user', async () => {
            // Get the ID of the user we just inserted
            const result = await db.query('SELECT * FROM users WHERE email = $1', ['johndoe@example.com']);
            const userId = result[0].id;

            // Make a PUT request with updated user data
            const response = await request(app)
                .put(`/admin/users/${userId}`)
                .send({ name: 'Jane Doe', email: 'janedoe@example.com' });

            // Check that the response has a 200 status code
            expect(response.status).toBe(200);

            // Check that the response body contains the updated user data
            expect(response.body.id).toBeDefined();
            expect(response.body.id).toBe(userId);
            expect(response.body.name).toBe('Jane Doe');
            expect(response.body.email).toBe('janedoe@example.com');

            // Check that the user was updated in the database
            const updatedUser = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
            expect(updatedUser.length).toBe(1);
            expect(updatedUser[0].name).toBe('Jane Doe');
            expect(updatedUser[0].email).toBe('janedoe@example.com');
        });

        test('should return a 400 error if name and email are not present', async () => {
            // Get the ID of the user we just inserted
            const result = await db.query('SELECT * FROM users WHERE email = $1', ['johndoe@example.com']);
            const userId = result[0].id;

            // Make a PUT request with missing fields
            const response = await request(app).put(`/admin/users/${userId}`).send({});

            // Check that the response has a 400 status code
            expect(response.status).toBe(400);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('Name and email are required');
        });

        test('should return a 400 error if email is not valid', async () => {
            // Get the ID of the user we just inserted
            const result = await db.query('SELECT * FROM users WHERE email = $1', ['johndoe@example.com']);
            const userId = result[0].id;

            // Make a PUT request with an invalid email
            const response = await request(app)
                .put(`/admin/users/${userId}`)
                .send({ name: 'Jane Doe', email: 'invalid-email' });

            // Check that the response has a 400 status code
            expect(response.status).toBe(400);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('Invalid email format');
        });

        test('should return a 400 error if email already exists', async () => {
            // Insert a user with a duplicate email into the database
            await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['Jane Doe', 'janedoe@example.com']);

            // Get the ID of the user we just inserted
            const result = await db.query('SELECT * FROM users WHERE email = $1', ['johndoe@example.com']);
            const userId = result[0].id;

            // Make
            const response = await request(app)
                .put(`/admin/users/${userId}`)
                .send({ name: 'Jane Doe', email: 'janedoe@example.com' });

            // Check that the response has a 400 status code
            expect(response.status).toBe(400);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('Email already exists');
        });

        test('should return a 404 error if user does not exist', async () => {
            // Make a PUT request with an invalid user ID
            const response = await request(app)
                .put('/admin/users/1234')
                .send({ name: 'Jane Doe', email: 'janedoe@example.com' });

            // Check that the response has a 404 status code
            expect(response.status).toBe(404);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('User not found');
        });
    });

    describe('DELETE /admin/users/:id', () => {
        beforeEach(async () => {
            // Truncate users table before each test
            await db.query('TRUNCATE TABLE users');
            // Insert a user into the database
            await db.query('INSERT INTO users (name, email) VALUES ($1, $2)', ['John Doe', 'johndoe@example.com']);
        });

        test('should delete an existing user', async () => {
            // Get the ID of the user we just inserted
            const result = await db.query('SELECT * FROM users WHERE email = $1', ['johndoe@example.com']);
            const userId = result[0].id;

            // Make a DELETE request to delete the user
            const response = await request(app).delete(`/admin/users/${userId}`);

            // Check that the response has a 200 status code
            expect(response.status).toBe(200);

            // Check that the response body contains the deleted user data
            expect(response.body.message).toBe('User deleted successfully');

            // Check that the user was deleted from the database
            const deletedUser = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
            expect(deletedUser.length).toBe(0);
        });

        test('should return a 404 error if user does not exist', async () => {
            // Make a DELETE request with an invalid user ID
            const response = await request(app).delete('/admin/users/1234');

            // Check that the response has a 404 status code
            expect(response.status).toBe(404);

            // Check that the response body contains an error message
            expect(response.body.message).toBeDefined();
            expect(response.body.message).toContain('User not found');
        });
    });
});