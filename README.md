# Auth Server 

A simple JWT auth server that handles user registration, login, and JWT validation.

## Table of Contents
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
  - [Register User](#register-user)
  - [Login User](#login-user)
  - [Verify JWT](#verify-jwt)
- [Testing with Insomnia or Postman](#testing-with-insomnia-or-postman)


## Setup

### TTFHW

1. Clone the repository:
```bash
git clone https://github.com/hallstrom91/fwk4-23-auth.git
```

2. Enter cloned repository directory:
```bash
cd fwk4-23-auth
```

3. Install required packages:
```bash 
npm install
```

4. Create .env or .env.development.local in the root folder of project:
```bash
DB_HOST=
DB_USER=
DB_DATABASE=
DB_PASSWORD=
PORT=
JWT_SECRET=
```
5. Start the auth server:
```npm
npm run dev
```

## API Endpoints

### Register User
**POST** `/auth/register`
Registers a new user by providing `fullname`, `email`, and `password`.

**REQUEST BODY:**
```JSON
{
  "fullname": "John Doe",
  "email": "johndoe@example.com",
  "password": "yourpassword"
}
```

**RESPONSE (SUCCESS 201):**
```JSON
{
  "message": "User registered successfully"
}
```

**Response (400 - Email already in use):**
```JSON
{
  "error": "Email already in use"
}
```

**Response (400 - Missing fields):**
```JSON
{
  "error": "Name, email or password value missing."
}
```

### Login User
**POST** `auth/login`
Authenticates a user by checking email and password, and returns a signed JWT if valid.

**Request Body:**
```JSON
{
  "email": "johndoe@example.com",
  "password": "yourpassword"
}
```

**Response (Success 200):**
```JSON
{
  "message": "Login successful",
  "token": "CREATED-AND-SIGNED-TOKEN"
}
```

**Response (400 - Invalid email or password):**
```JSON
{
  "error": "Invalid email or password"
}
```


**Response (400 - Missing fields):**
```JSON
{
  "error": "Email or password value missing"
}
```


### Verify JWT
**POST** `/auth/verify`

Verifies the validity of a JWT.

**Request Body:**
```JSON
{
  "token": "ADD-JWT-TOKEN-HERE"
}
```
**Response (Success 200):**
```JSON
{
  "verified": true,
  "message": {
    "userId": "12345",
    "email": "user@example.com",
    "role": "admin",
    "iat": 1729084114,
    "exp": 1729087714
  }
}
```

**Response (401 - Invalid/Expired token):**
```JSON
{
  "verified": false,
  "error": "Invalid or expired token"
}
```

**Response (400 - Missing token):**
```JSON
{
  "error": "Token missing"
}
```

## Testing with Insomnia or Postman
You can use Insomnia or Postman to test the API endpoints by sending the appropriate requests as documented above.

### Example Requests:
1. **Register User:** POST to `/auth/register` with a JSON body containing fullname, email, and password.
2. **Login User:** POST to `/auth/login` with a JSON body containing email and password.
3. **Verify JWT:** POST to `/auth/verify` with a JSON body containing the token received from login.
