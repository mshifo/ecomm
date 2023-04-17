# User Management API

This is a Node.js REST API built with Express, TypeScript, and PostgreSQL that allows users to create, read, update, and delete user accounts, as well as register and login to the application.

## Installation
1. Clone this repository.
2. Run `npm install` to install the necessary dependencies.
3. Create a PostgreSQL database.
4. Create a .env file in the root of the project and add the following environment variables:
```
DB_HOST=<database host>
DB_PORT=<database port>
DB_USER=<database user>
DB_PASSWORD=<database password>
DB_DATABASE=<database name>
JWT_SECRET=<JWT secret key>
```
5. Run `npm run start` to start the server.

## Usage
### User Endpoints
````makefile
GET /users
Get a list of all users.

GET /users/:id
Get a single user by ID.

POST /users
Create a new user.

PUT /users/:id
Update an existing user.

DELETE /users/:id
Delete a user by ID.
````

Authentication Endpoints
````makefile
POST /register
Create a new user account.
````
Request body:
````c
{
  "name": string,
  "email": string,
  "password": string
}
````
````makefile
POST /login
Authenticate a user.
````

Request body:
````c
{
  "email": string,
  "password": string
}
````
Response body:
````c

{
  "token": string
}
````

### Error Responses
The API returns the following error responses:

#### 400 Bad Request
Returned when the client sends an invalid request. The response body will contain a JSON object with an error message.

#### 401 Unauthorized
Returned when the client is not authorized to access a resource. The response body will contain a JSON object with an error message.

#### 404 Not Found
Returned when the requested resource cannot be found. The response body will contain a JSON object with an error message.

#### 500 Internal Server Error
Returned when an unexpected error occurs on the server. The response body will contain a JSON object with an error message.

### Testing
To run the unit tests, run the command ` npm run test`. This will run all tests in the `__tests__` directory.

### License
This project is licensed under the MIT License.